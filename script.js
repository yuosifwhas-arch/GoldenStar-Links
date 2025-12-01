document.addEventListener('DOMContentLoaded', () => {
    
    // العناصر الأساسية للتحكم
    const orderButtonWrapper = document.getElementById('orderButton'); 
    const orderButtonText = orderButtonWrapper ? orderButtonWrapper.querySelector('span') : null;
    const availableBadge = orderButtonWrapper ? orderButtonWrapper.querySelector('.available-badge') : null;
    const buttonVisuals = orderButtonWrapper ? orderButtonWrapper.querySelector('.btn-3d') : null;
    
    const countdownElement = document.getElementById('offer-countdown');
    const offersButtonWrapper = document.getElementById('offersButton');
    // ⭐️⭐️⭐️ تم تغيير ID الحاوية ⭐️⭐️⭐️
    const menuGallery = document.getElementById('menu-gallery'); 
    
    // تعريف الألوان الافتراضية
    const OPEN_BG = 'bg-[#FFC700]';
    const OPEN_BORDER = 'border-[#C99B00]';
    const OPEN_TEXT = 'text-red-900';
    const OPEN_SHADOW = 'shadow-[0_0_30px_rgba(255,199,0,0.7)]';
    const CLOSED_BG = 'bg-gray-600';
    const CLOSED_BORDER = 'border-gray-800';
    const CLOSED_TEXT = 'text-white/80';
    
    // ----------------------------------------------------------------------
    // الوظيفة 1: تحديد ساعات العمل (Smart Availability)
    // ----------------------------------------------------------------------

    const checkBusinessHours = () => {
        const now = new Date();
        const currentHour = now.getHours(); 

        // 🚨 ساعات العمل: من 10 صباحاً (10) إلى 2 صباحاً (2)
        const OPEN_HOUR = 10; 
        const CLOSE_HOUR = 2; 

        let isClosed;
        
        if (CLOSE_HOUR < OPEN_HOUR) { 
            isClosed = currentHour >= CLOSE_HOUR && currentHour < OPEN_HOUR;
        } else {
            isClosed = currentHour < OPEN_HOUR || currentHour >= CLOSE_HOUR;
        }

        if (isClosed) {
            // إغلاق الزر وتغيير مظهره
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
             // فتح الزر وإضافة تأثير النبض المؤقت
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
        
        // 🚨 التاريخ المحدد لانتهاء العرض (مثال: 4 ديسمبر 2025، الساعة 23:59:59)
        const offerEndDate = new Date(2025, 11, 4, 23, 59, 59).getTime(); 

        if (isNaN(offerEndDate) || offerEndDate < new Date().getTime()) {
             if (countdownElement) {
                countdownElement.textContent = 'انتهى العرض!';
                if(offersButtonWrapper) { offersButtonWrapper.removeAttribute('href'); }
            }
            return;
        }

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

        updateCounter();
        const countdownInterval = setInterval(updateCounter, 1000);
    };

    // ----------------------------------------------------------------------
    // الوظيفة 3: جلب البيانات وعرض الصور (كـ معرض متدفق)
    // ----------------------------------------------------------------------
    const fetchAndDisplayGallery = async () => {
        // نتحقق من وجود الحاوية الجديدة
        if (!menuGallery) return;

        try {
            // جلب البيانات من ملف menu.json
            const response = await fetch('menu.json');
            if (!response.ok) {
                menuGallery.innerHTML = '<div class="text-center text-red-400 p-4">⚠️ فشل تحميل قائمة الطعام (تأكد من وجود ملف menu.json).</div>';
                console.error("Failed to fetch menu data:", response.statusText);
                return;
            }
            const data = await response.json();
            const menuItems = data.menuItems || [];

            menuGallery.innerHTML = ''; 

            if (menuItems.length === 0) {
                 menuGallery.innerHTML = '<div class="text-center text-gray-400 p-4">لا توجد أطباق لعرضها حالياً في ملف menu.json.</div>';
                 return;
            }

            // بناء عناصر المعرض ديناميكياً
            menuItems.forEach(item => {
                const galleryItem = document.createElement('div');
                // تنسيقات بسيطة لكل صورة مع حواف وظل
                galleryItem.className = 'rounded-xl overflow-hidden shadow-2xl relative border border-white/10 group bg-black/50'; 
                
                galleryItem.innerHTML = `
                    <img src="${item.imagePath}" alt="${item.title}" class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]">
                    
                    <div class="absolute bottom-0 w-full bg-black/60 text-white p-2 text-center font-bold text-lg">
                        ${item.title}
                    </div>
                `;
                menuGallery.appendChild(galleryItem);
            });

        } catch (error) {
            console.error('Error processing menu data or initializing gallery:', error);
            if (menuGallery) {
                menuGallery.innerHTML = '<div class="text-center text-red-400 p-4">حدث خطأ غير متوقع في عرض الصور.</div>';
            }
        }
    };

    // تشغيل جميع الوظائف عند تحميل الصفحة
    checkBusinessHours();
    startCountdown();
    fetchAndDisplayGallery(); // ⭐️ تم تغيير اسم الدالة وإزالة Splide ⭐️
    
});
 
