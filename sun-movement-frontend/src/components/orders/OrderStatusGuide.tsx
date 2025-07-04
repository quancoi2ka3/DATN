import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CreditCard, 
  Package, 
  Truck, 
  CheckCircle2, 
  Award,
  XCircle,
  RotateCcw 
} from 'lucide-react';

interface OrderStatusGuideProps {
  currentStatus: string;
}

export function OrderStatusGuide({ currentStatus }: OrderStatusGuideProps) {
  const statusFlow = [
    {
      key: 'pending',
      label: 'Chờ xác nhận',
      description: 'Đơn hàng mới tạo, đang chờ shop xác nhận',
      icon: Clock,
      color: 'bg-gray-100 text-gray-600',
    },
    {
      key: 'processing',
      label: 'Đã xác nhận',
      description: 'Shop đã xác nhận và đang xử lý đơn hàng',
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      key: 'shipped',
      label: 'Đang giao',
      description: 'Đơn hàng đang được vận chuyển',
      icon: Truck,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      key: 'delivered',
      label: 'Đã giao',
      description: 'Đơn hàng đã được giao đến địa chỉ của bạn',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-600',
    },
    {
      key: 'completed',
      label: 'Hoàn thành',
      description: 'Bạn đã xác nhận nhận hàng, đơn hàng hoàn thành',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  const getCurrentStepIndex = () => {
    return statusFlow.findIndex(step => step.key === currentStatus.toLowerCase());
  };

  const currentStepIndex = getCurrentStepIndex();

  // Special statuses
  const isCompleted = currentStatus.toLowerCase() === 'completed';
  const isCancelled = currentStatus.toLowerCase() === 'cancelled';
  const isRefunded = currentStatus.toLowerCase() === 'refunded';

  if (isCancelled || isRefunded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Trạng thái đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <XCircle className="h-8 w-8 text-red-600 shrink-0" />
            <div>
              <div className="font-medium text-red-900">
                {isCancelled ? 'Đơn hàng đã bị hủy' : 'Đơn hàng đã được hoàn tiền'}
              </div>
              <div className="text-sm text-red-600">
                {isCancelled 
                  ? 'Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.'
                  : 'Đơn hàng này đã được hoàn tiền về tài khoản của bạn.'
                }
              </div>
            </div>
          </div>
          
          {isCancelled && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800 text-sm">
                <RotateCcw className="h-4 w-4" />
                <span>Bạn có thể đặt lại đơn hàng tương tự bằng cách nhấn nút "Mua lại"</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Trạng thái đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusFlow.map((step, index) => {
            const IconComponent = step.icon;
            const isCurrentStep = index === currentStepIndex;
            const isCompletedStep = index < currentStepIndex || (isCompleted && index === statusFlow.length - 1);
            const isFutureStep = index > currentStepIndex && !isCompleted;

            return (
              <div key={step.key} className="flex items-start gap-4">
                {/* Status Icon */}
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full shrink-0
                  ${isCompletedStep 
                    ? 'bg-green-600 text-white' 
                    : isCurrentStep 
                      ? step.color.replace('100', '200').replace('600', '700')
                      : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Status Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      font-medium text-sm
                      ${isCompletedStep 
                        ? 'text-green-700' 
                        : isCurrentStep 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                      }
                    `}>
                      {step.label}
                    </span>
                    
                    {isCurrentStep && (
                      <Badge variant="default" className="text-xs">
                        Hiện tại
                      </Badge>
                    )}
                    
                    {isCompletedStep && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <p className={`
                    text-xs
                    ${isCompletedStep || isCurrentStep 
                      ? 'text-gray-600' 
                      : 'text-gray-400'
                    }
                  `}>
                    {step.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < statusFlow.length - 1 && (
                  <div className={`
                    absolute left-8 mt-8 w-0.5 h-4
                    ${isCompletedStep ? 'bg-green-600' : 'bg-gray-200'}
                  `} style={{ marginLeft: '15px' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Special message for delivered status */}
        {currentStatus.toLowerCase() === 'delivered' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-medium">Đơn hàng đã được giao thành công!</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Hãy xác nhận đã nhận hàng để hoàn thành đơn hàng và nhận được điểm tích lũy.
            </p>
          </div>
        )}

        {/* Special message for completed status */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-800 text-sm">
              <Award className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Cảm ơn bạn đã mua hàng!</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              Đơn hàng đã hoàn thành. Bạn có thể đánh giá sản phẩm hoặc mua lại đơn hàng tương tự.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
