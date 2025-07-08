# FIX: Maximum Update Depth Exceeded Error

## Tóm tắt vấn đề
Lỗi "Maximum update depth exceeded" xảy ra khi chuyển trang từ supplements sang sportswear do vòng lặp vô hạn trong `useEffect` của các TopControls components.

## Nguyên nhân gốc rễ
1. **Dependency Array Issue**: `useEffect` trong `SportswearTopControls` và `SupplementsTopControls` bao gồm `onFilteredProductsChange` trong dependency array
2. **Function Reference Instability**: Mỗi lần parent component re-render, `setFilteredProducts` tạo reference mới
3. **Infinite Loop**: `useEffect` → `onFilteredProductsChange` → parent re-render → new function reference → `useEffect` lại chạy

## Các thay đổi đã thực hiện

### 1. Fixed useScroll Hook
- **File**: `src/lib/useScroll.ts`
- **Thay đổi**: Sử dụng refs để tránh dependency changes, empty dependency array trong useEffect chính

### 2. Fixed SportswearTopControls Component  
- **File**: `src/components/ui/SportswearTopControls.tsx`
- **Thay đổi**: Loại bỏ `onFilteredProductsChange` khỏi dependency array

### 3. Fixed SupplementsTopControls Component
- **File**: `src/components/ui/SupplementsTopControls.tsx` 
- **Thay đổi**: Loại bỏ `onFilteredProductsChange` khỏi dependency array

### 4. Improved SportswearPage Component
- **File**: `src/app/store/sportswear/page.tsx`
- **Thay đổi**: 
  - Sử dụng `useCallback` cho stable function references
  - Sử dụng `useMemo` cho pagination calculations
  - Tránh inline functions trong JSX

## Code Pattern Best Practices

### ❌ Sai - Gây infinite loop:
```tsx
useEffect(() => {
  // ... logic ...
  onSomeCallback(result);
}, [dependency1, dependency2, onSomeCallback]); // ❌ onSomeCallback trong deps
```

### ✅ Đúng - Stable references:
```tsx
// Trong parent component:
const handleSomeCallback = useCallback((data) => {
  setSomeState(data);
}, []);

// Trong child component:
useEffect(() => {
  // ... logic ...
  onSomeCallback(result);
}, [dependency1, dependency2]); // ✅ Không include callback trong deps
```

## Tools để Debug

### 1. Render Monitor
- **File**: `src/lib/renderMonitor.ts`
- **Sử dụng**:
```tsx
import { useRenderMonitor } from '@/lib/renderMonitor';

function MyComponent() {
  useRenderMonitor('MyComponent', [prop1, prop2]);
  // ... component logic
}
```

### 2. Scroll Debugger
- **File**: `src/lib/scrollDebugger.ts`
- **Sử dụng**:
```tsx
import scrollDebugger from '@/lib/scrollDebugger';

useEffect(() => {
  const cleanup = scrollDebugger.monitorScrollEvents();
  return cleanup;
}, []);
```

## Kiểm tra thêm

Để tránh vấn đề tương tự trong tương lai:

1. **Tìm kiếm patterns có nguy cơ**:
```bash
# Tìm useEffect có callback functions trong dependency
grep -r "useEffect.*on.*Change.*\]" src/
```

2. **Kiểm tra inline functions**:
```bash  
# Tìm inline functions trong JSX
grep -r "onClick={() =>" src/
```

3. **Monitor performance**:
```tsx
// Thêm vào components quan trọng
import { useRenderMonitor } from '@/lib/renderMonitor';
useRenderMonitor('ComponentName');
```

## Testing
Để test fix:

1. Mở trang `/store/supplements`
2. Navigate đến `/store/sportswear`  
3. Kiểm tra console không có lỗi "Maximum update depth exceeded"
4. Test filtering, sorting, pagination hoạt động bình thường
5. Monitor performance với dev tools

## Lưu ý quan trọng

- **Không include callback functions trong useEffect dependencies** trừ khi chúng được wrap trong `useCallback`
- **Sử dụng `useCallback` và `useMemo`** để tạo stable references
- **Tránh inline functions** trong props của child components
- **Monitor renders** trong development để phát hiện sớm vấn đề

---
*Fix completed on: ${new Date().toLocaleDateString('vi-VN')}*
