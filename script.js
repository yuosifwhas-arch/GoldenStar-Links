document.addEventListener('DOMContentLoaded', () => {
    
    const orderButtonWrapper = document.getElementById('orderButton'); // عنصر الرابط <a>
    
    // العناصر التي سنغير محتواها
    const orderButtonText = orderButtonWrapper ? orderButtonWrapper.querySelector('span') : null;
    const availableBadge = orderButtonWrapper ? orderButtonWrapper.querySelector('.absolute.top-[-10px]') : null;
    const buttonVisuals = orderButtonWrapper ? orderButtonWrapper.querySelector('.btn-3d') : null;
    

    // الوظيفة 1: التعليق التلقائي على زر "اطلب الآن" (Aura Effect)
    // هذا التأثير سيتم تطبيقه فقط إذا كان المطعم مفتوحاً
    if (orderButtonWrapper) {
        orderButtonWrapper.classList.add('animate-pulse');

        setTimeout(() => {
            orderButtonWrapper.classList.remove('animate-pulse');
        }, 5000); 
    }


    // ----------------------------------------------------------------------
    // الوظيفة 2: تحديد ساعات العمل (Smart Availability)
    // ----------------------------------------------------------------------

    const checkBusinessHours = () => {
        const now = new Date();
        const currentHour = now.getHours(); // الساعة الحالية (0 = 12 ليلاً، 13 = 1 ظهراً)

        // تحديد ساعات العمل: من 10:00 صباحاً (10) إلى 01:00 بعد منتصف الليل (1)
        // ساعات العمل: 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0
        // الساعات المغلقة: 2, 3, 4, 5, 6, 7, 8, 9 
        
        // ملاحظة: الساعة 1 بعد منتصف الليل هي الساعة 1، لكننا سنستخدم 2 لتغطيتها بالكامل.
        // أي أن المطعم مفتوح من 10 صباحاً حتى 2 صباحاً (الساعة 2 صباحاً يكون مغلقاً).
        const OPEN_HOUR = 10; 
        const CLOSE_HOUR = 2; // الساعة 2 صباحاً يكون المطعم مغلقاً

        let isClosed;
        
        // التحقق مما إذا كانت الساعة الحالية بين ساعة الإغلاق و ساعة الافتتاح
        if (CLOSE_HOUR < OPEN_HOUR) {
            // (ساعات العمل تمتد عبر منتصف الليل) 
            isClosed = currentHour >= CLOSE_HOUR && currentHour < OPEN_HOUR;
        } else {
             // (ساعات العمل لا تمتد عبر منتصف الليل)
            isClosed = currentHour < OPEN_HOUR || currentHour >= CLOSE_HOUR;
        }

        if (isClosed) {
            // 1. إزالة رابط الطلب
            orderButtonWrapper.removeAttribute('href');
            orderButtonWrapper.style.cursor = 'default';

            // 2. تغيير النصوص والألوان
            if (orderButtonText) {
                orderButtonText.textContent = 'المطعم مغلق حالياً 😴';
            }
            if (availableBadge) {
                availableBadge.textContent = 'مغلق';
                availableBadge.className = availableBadge.className.replace('bg-red-600', 'bg-gray-500'); // تغيير لون البادج
            }
            if (buttonVisuals) {
                 // تغيير لون الزر الأساسي ليصبح رمادياً ليعكس الإغلاق
                buttonVisuals.className = buttonVisuals.className.replace('bg-[#FFC700]', 'bg-gray-600').replace('border-[#C99B00]', 'border-gray-800').replace('text-red-900', 'text-white/80').replace('shadow-[0_0_30px_rgba(255,199,0,0.7)]', 'shadow-none');
            }
            
            // 3. إيقاف تأثير التوهج عند الإغلاق
            orderButtonWrapper.classList.remove('animate-pulse');
        }
    };

    // تشغيل وظيفة التحقق عند تحميل الصفحة
    checkBusinessHours();
    
    // يمكن تفعيل التحديث كل دقيقة إذا كان الموقع سيظل مفتوحاً لوقت طويل
    // setInterval(checkBusinessHours, 60000); 
});

