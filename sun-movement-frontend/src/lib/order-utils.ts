export interface OrderStatus {
  value: string;
  label: string;
  description: string;
  color: 'default' | 'secondary' | 'destructive' | 'outline';
  icon: string;
  allowCancel: boolean;
  allowReorder: boolean;
  allowReview: boolean;
  allowTracking: boolean;
}

export const ORDER_STATUSES: Record<string, OrderStatus> = {
  pending: {
    value: 'pending',
    label: 'Chờ xác nhận',
    description: 'Đơn hàng mới tạo, đang chờ shop xác nhận',
    color: 'outline',
    icon: 'Clock',
    allowCancel: true,
    allowReorder: false,
    allowReview: false,
    allowTracking: false,
  },
  awaitingpayment: {
    value: 'awaitingpayment',
    label: 'Chờ thanh toán',
    description: 'Đơn hàng đang chờ thanh toán',
    color: 'outline',
    icon: 'CreditCard',
    allowCancel: true,
    allowReorder: false,
    allowReview: false,
    allowTracking: false,
  },
  paid: {
    value: 'paid',
    label: 'Đã thanh toán',
    description: 'Đã thanh toán thành công',
    color: 'default',
    icon: 'CheckCircle',
    allowCancel: false,
    allowReorder: false,
    allowReview: false,
    allowTracking: false,
  },
  processing: {
    value: 'processing',
    label: 'Đã xác nhận',
    description: 'Shop đã xác nhận và đang xử lý đơn hàng',
    color: 'secondary',
    icon: 'Package',
    allowCancel: false,
    allowReorder: false,
    allowReview: false,
    allowTracking: false,
  },
  awaitingfulfillment: {
    value: 'awaitingfulfillment',
    label: 'Đang đóng gói',
    description: 'Đang chuẩn bị hàng và đóng gói',
    color: 'secondary',
    icon: 'Package',
    allowCancel: false,
    allowReorder: false,
    allowReview: false,
    allowTracking: false,
  },
  shipped: {
    value: 'shipped',
    label: 'Đang vận chuyển',
    description: 'Đã giao cho đơn vị vận chuyển',
    color: 'secondary',
    icon: 'Truck',
    allowCancel: false,
    allowReorder: false,
    allowReview: false,
    allowTracking: true,
  },
  delivered: {
    value: 'delivered',
    label: 'Đã giao',
    description: 'Đơn hàng đã được giao thành công',
    color: 'default',
    icon: 'CheckCircle',
    allowCancel: false,
    allowReorder: true,
    allowReview: true,
    allowTracking: true,
  },
  completed: {
    value: 'completed',
    label: 'Hoàn thành',
    description: 'Đơn hàng đã hoàn thành',
    color: 'default',
    icon: 'CheckCircle',
    allowCancel: false,
    allowReorder: true,
    allowReview: true,
    allowTracking: true,
  },
  cancelled: {
    value: 'cancelled',
    label: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy',
    color: 'destructive',
    icon: 'XCircle',
    allowCancel: false,
    allowReorder: true,
    allowReview: false,
    allowTracking: false,
  },
  failed: {
    value: 'failed',
    label: 'Thất bại',
    description: 'Đơn hàng gặp sự cố',
    color: 'destructive',
    icon: 'XCircle',
    allowCancel: false,
    allowReorder: true,
    allowReview: false,
    allowTracking: false,
  },
};

export const PAYMENT_STATUSES: Record<string, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline'; icon: string }> = {
  pending: {
    label: 'Chờ thanh toán',
    color: 'outline',
    icon: 'Clock',
  },
  paid: {
    label: 'Đã thanh toán',
    color: 'default',
    icon: 'CheckCircle',
  },
  failed: {
    label: 'Thanh toán thất bại',
    color: 'destructive',
    icon: 'XCircle',
  },
  refunded: {
    label: 'Đã hoàn tiền',
    color: 'secondary',
    icon: 'RefreshCw',
  },
  partiallypaid: {
    label: 'Thanh toán một phần',
    color: 'outline',
    icon: 'Clock',
  },
  partiallyrefunded: {
    label: 'Hoàn tiền một phần',
    color: 'outline',
    icon: 'RefreshCw',
  },
  cancelled: {
    label: 'Đã hủy thanh toán',
    color: 'destructive',
    icon: 'XCircle',
  },
};

export function getOrderStatus(status: string): OrderStatus {
  return ORDER_STATUSES[status.toLowerCase()] || ORDER_STATUSES.pending;
}

export function getPaymentStatus(status: string) {
  return PAYMENT_STATUSES[status.toLowerCase()] || PAYMENT_STATUSES.pending;
}

export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function generateOrderCode(orderId: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `DH${year}${month}${day}${orderId.padStart(4, '0')}`;
}

// Timeline data for order status
export function getOrderTimeline(status: string, orderDate: string) {
  const currentStatus = getOrderStatus(status);
  const statusFlow = ['pending', 'processing', 'awaitingfulfillment', 'shipped', 'delivered'];
  
  const timeline = statusFlow.map((stepStatus, index) => {
    const stepInfo = getOrderStatus(stepStatus);
    const currentIndex = statusFlow.indexOf(status.toLowerCase());
    const isCompleted = index <= currentIndex;
    const isCurrent = index === currentIndex;
    
    return {
      status: stepStatus,
      label: stepInfo.label,
      description: stepInfo.description,
      isCompleted,
      isCurrent,
      date: isCompleted ? (isCurrent ? orderDate : null) : null,
    };
  });
  
  return timeline;
}
