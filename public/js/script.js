const logout = document.querySelector('.logout');
const profile = document.querySelector('.profile');

if (logout !== null) {
    $('svg').on('mouseenter', function(){
        logout.style.opacity = 1;
    });
    
    $('nav').on('mouseleave', function() {
        logout.style.opacity = 0;
    });
};

