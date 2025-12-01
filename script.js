document.addEventListener('DOMContentLoaded', () => {
    
    // عناصر زر اطلب الآن (للوظيفة 1: ساعات العمل والتوهج)
    const orderButtonWrapper = document.getElementById('orderButton'); 
    const orderButtonText = orderButtonWrapper ? orderButtonWrapper.querySelector('span') : null;
    const availableBadge = orderButtonWrapper ? orderButtonWrapper.querySelector('.available-badge') : null;
    const buttonVisuals = orderButtonWrapper ? orderButtonWrapper.querySelector('.btn-3d') : null;
    
    // الألوان الافتراضية لزر الطلب
    const OPEN_BG = 'bg-[#FFC700]';
    const OPEN_BORDER = 'border-[#C99B00]';
    const OPEN_TEXT = 'text-red-900';
    const OPEN_SHADOW = 'shadow-[0_0_30px_rgba(255,199,0,0.7)]';
    const CLOSED_BG = 'bg-gray-600';
    const CLOSED_BORDER = 'border-gray-800';
    const CLOSED_TEXT = 'text-white/80';
    
    // عناصر زر العروض (للوظيفة 2: العداد التنازلي)
    const countdownElement = document.getElementById('offer-countdown');
    const offersButtonWrapper = document.getElementById('offersButton');
    
    // ----------------------------------------------------------------------
    // الوظيفة 1: تحديد ساعات العمل (Smart Availability)
    // ----------------------------------------------------------------------

    const checkBusinessHours = () => {
        const now = new Date();
        const currentHour = now.getHours(); 

        // 🚨 ساعات العمل: من 10 صباحاً إلى 2 صباحاً
        const OPEN_HOUR = 10; 
        const CLOSE_HOUR = 2; 

        let isClosed;
        
        if (CLOSE_HOUR < OPEN_HOUR) { 
            isClosed = currentHour >= CLOSE_HOUR && currentHour < OPEN_HOUR;
        } else {
            isClosed = currentHour < OPEN_HOUR || currentHour >= CLOSE_HOUR;
        }

        if (isClosed) {
            if (orderButtonWrapper) {
                orderButtonWrapper.removeAttribute('href');
                orderButtonWrapper.style.cursor = 'default';
                orderButtonWrapper.classList.remove('animate-pulse');
            }
            if (orderButtonText) { orderButtonText.textContent = 'المطعم مغلق حالياً 😴'; }
            if (availableBadge) {
                availableBadge.textContent = 'مغلق';
                availableBadge.className = availableBadge.className.replace('bg-red-600', 'bg-gray-500'); 
            }
            if (buttonVisuals) {
                 buttonVisuals.className = buttonVisuals.className
                    .replace(OPEN_BG, CLOSED_BG)
                    .replace(OPEN_BORDER, CLOSED_BORDER)
                    .replace(OPEN_TEXT, CLOSED_TEXT)
                    .replace(OPEN_SHADOW, 'shadow-none');
            }
        } else {
            // حالة الفتح: تفعيل التوهج التلقائي لزر الطلب
             if (orderButtonWrapper) {
                orderButtonWrapper.classList.add('animate-pulse');
                setTimeout(() => {
                    orderButtonWrapper.classList.remove('animate-pulse');
                }, 5000); 
            }
        }
    };

    // ----------------------------------------------------------------------
    // الوظيفة 2: العداد التنازلي للعروض (Offer Countdown Timer)
    // ----------------------------------------------------------------------
    const startCountdown = () => {
        
        // ⭐️⭐️⭐️ هذا هو السطر الذي تم تعديله ⭐️⭐️⭐️
        // استخدمنا صيغة YYYY/MM/DD HH:MM:SS الموثوقة
        const offerEndDate = new Date('2025/12/04 23:59:59').getTime(); 

        const updateCounter = () => {
            const now = new Date().getTime();
            const distance = offerEndDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                if (countdownElement) {
                    countdownElement.textContent = 'انتهى العرض!';
                    if(offersButtonWrapper) {
                         offersButtonWrapper.removeAttribute('href');
                         offersButtonWrapper.style.cursor = 'default';
                    }
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const formatTime = (time) => String(time).padStart(2, '0');

            if (countdownElement) {
                countdownElement.innerHTML = 
                    `<span class="text-red-400 font-extrabold">${days}يوم</span>` +
                    ` | ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)} <span class="text-xs">متبقي</span>`;
            }
        };

        // تحديث العداد فوراً ثم كل ثانية
        updateCounter();
        const countdownInterval = setInterval(updateCounter, 1000);
    };

    // تشغيل جميع الوظائف عند تحميل الصفحة
    checkBusinessHours();
    startCountdown();
    
});
