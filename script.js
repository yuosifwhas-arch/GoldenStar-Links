document.addEventListener('DOMContentLoaded', () => {
    
    const orderButtonWrapper = document.getElementById('orderButton'); 
    
    // العناصر التي سنغير محتواها
    const orderButtonText = orderButtonWrapper ? orderButtonWrapper.querySelector('span') : null;
    const availableBadge = orderButtonWrapper ? orderButtonWrapper.querySelector('.available-badge') : null;
    const buttonVisuals = orderButtonWrapper ? orderButtonWrapper.querySelector('.btn-3d') : null;
    
    // الألوان الافتراضية (للرجوع إليها)
    const OPEN_BG = 'bg-[#FFC700]';
    const OPEN_BORDER = 'border-[#C99B00]';
    const OPEN_TEXT = 'text-red-900';
    const OPEN_SHADOW = 'shadow-[0_0_30px_rgba(255,199,0,0.7)]';

    const CLOSED_BG = 'bg-gray-600';
    const CLOSED_BORDER = 'border-gray-800';
    const CLOSED_TEXT = 'text-white/80';


    // الوظيفة 2: تحديد ساعات العمل (Smart Availability)
    const checkBusinessHours = () => {
        const now = new Date();
        const currentHour = now.getHours(); 

        // 🚨 قم بتعديل هذه الساعات حسب وقت عمل المطعم
        // هنا: العمل من 10:00 صباحاً (10) إلى 02:00 صباحاً (2)
        const OPEN_HOUR = 10; 
        const CLOSE_HOUR = 2; // الساعة 2 صباحاً يكون المطعم مغلقاً

        let isClosed;
        
        // التحقق مما إذا كانت الساعة الحالية بين ساعة الإغلاق و ساعة الافتتاح (تغطية منتصف الليل)
        if (CLOSE_HOUR < OPEN_HOUR) { 
            // ساعات العمل تمتد عبر منتصف الليل (مثال: من 22 إلى 2)
            isClosed = currentHour >= CLOSE_HOUR && currentHour < OPEN_HOUR;
        } else {
             // ساعات العمل لا تمتد عبر منتصف الليل (مثال: من 10 إلى 22)
            isClosed = currentHour < OPEN_HOUR || currentHour >= CLOSE_HOUR;
        }

        if (isClosed) {
            // حالة الإغلاق
            if (orderButtonWrapper) {
                // إزالة رابط الطلب
                orderButtonWrapper.removeAttribute('href');
                orderButtonWrapper.style.cursor = 'default';
                // إزالة التوهج النبضي (إذا كان مفعلاً)
                orderButtonWrapper.classList.remove('animate-pulse');
            }

            if (orderButtonText) {
                orderButtonText.textContent = 'المطعم مغلق حالياً 😴';
            }
            if (availableBadge) {
                availableBadge.textContent = 'مغلق';
                // تغيير لون البادج من الأحمر إلى الرمادي
                availableBadge.className = availableBadge.className.replace('bg-red-600', 'bg-gray-500'); 
            }
            if (buttonVisuals) {
                 // تغيير لون الزر الأساسي إلى رمادي وإزالة الظل المتوهج
                buttonVisuals.className = buttonVisuals.className
                    .replace(OPEN_BG, CLOSED_BG)
                    .replace(OPEN_BORDER, CLOSED_BORDER)
                    .replace(OPEN_TEXT, CLOSED_TEXT)
                    .replace(OPEN_SHADOW, 'shadow-none');
            }
        } else {
            // حالة الفتح - تفعيل التوهج التلقائي (Aura Effect)
             if (orderButtonWrapper) {
                orderButtonWrapper.classList.add('animate-pulse');

                setTimeout(() => {
                    orderButtonWrapper.classList.remove('animate-pulse');
                }, 5000); // 5 ثوانٍ
            }
        }
    };

    // تشغيل وظيفة التحقق عند تحميل الصفحة
    checkBusinessHours();
    
});
