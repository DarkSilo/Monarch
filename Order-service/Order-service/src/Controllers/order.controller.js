const Order = require("../Models/order.model");
const axios = require("axios");

function isAdmin(req) {
  return req.user?.role === "admin";
}

function getCurrentUserId(req) {
  return req.user?.userId || req.user?.sub || req.user?.id || req.user?.customerId || null;
}

async function validateInventory(productId, quantity) {
  const inventoryServiceUrl = process.env.INVENTORY_SERVICE_URL;
  if (!inventoryServiceUrl || !productId) {
    return false;
  }

  const endpoint = `${inventoryServiceUrl.replace(/\/$/, "")}/${encodeURIComponent(productId)}/availability`;
  const response = await axios.get(endpoint, {
    params: { quantity },
    timeout: Number(process.env.INVENTORY_TIMEOUT_MS || 3000),
  });

  const payload = response.data || {};
  if (typeof payload.available === "boolean") {
    return payload.available;
  }

  if (typeof payload.isAvailable === "boolean") {
    return payload.isAvailable;
  }

  return false;
}

function parseAndValidateCreatePayload(req) {
  const requestedCustomerId = req.body.customerId;
  const currentUserId = getCurrentUserId(req);
  const customerId = requestedCustomerId || currentUserId;
  const { productId, productName, totalAmount } = req.body;
  const quantity = Number(req.body.quantity ?? 1);

  if (!customerId) {
    return { error: "customerId is required" };
  }

  if (!productId && !productName) {
    return { error: "Either productId or productName is required" };
  }

  if (!Number.isFinite(totalAmount) || Number(totalAmount) <= 0) {
    return { error: "totalAmount must be a number greater than 0" };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { error: "quantity must be a positive integer" };
  }

  if (!isAdmin(req) && requestedCustomerId && requestedCustomerId !== currentUserId) {
    return { error: "You can only create orders for yourself" };
  }

  return {
    payload: {
      customerId,
      productId: productId || null,
      productName: productName || null,
      totalAmount: Number(totalAmount),
      quantity,
    },
  };
}

// POST /orders - Create new order
const createOrder = async (req, res) => {
  try {
    const parsed = parseAndValidateCreatePayload(req);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const { customerId, productId, productName, totalAmount, quantity } = parsed.payload;

    let inventoryValidated = false;
    if (productId && process.env.INVENTORY_SERVICE_URL) {
      try {
        const available = await validateInventory(productId, quantity);
        if (!available) {
          return res.status(409).json({ message: "Requested quantity is not available in inventory" });
        }
        inventoryValidated = true;
      } catch (inventoryError) {
        if (process.env.INVENTORY_VALIDATION_REQUIRED === "true") {
          return res.status(503).json({
            message: "Inventory service is unavailable and validation is required",
          });
        }
      }
    }

    const order = new Order({
      customerId,
      productId,
      productName,
      totalAmount,
      quantity,
      inventoryValidated,
    });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// GET /orders - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const query = isAdmin(req) ? {} : { customerId: getCurrentUserId(req) };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// GET /orders/:id - Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!isAdmin(req)) {
      const currentUserId = getCurrentUserId(req);
      if (!currentUserId || order.customerId !== currentUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// PUT /orders/:id - Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// DELETE /orders/:id - Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
