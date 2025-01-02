const registrationSlide = document.getElementById("registration");
const authorizationSlide = document.getElementById("authorization");

const hidden = document.getElementById("hidden");
const aboutBlock = document.getElementById("about");

const aboutBlockHeader = aboutBlock.getElementsByTagName("h1")[0];
const aboutBlockParagraph = aboutBlock.getElementsByTagName("p")[0];


// let authorizationHiddenBlockIsVisible = false;
let authorizationHiddenBlockIsVisible = true;

const hideAboutBlock = () => {
    aboutBlockHeader.style.left = "-100vh";
    aboutBlockParagraph.style.right = "-100vh";
}

const reverseAboutBlock = () => {
    aboutBlockHeader.style.left = "0";
    aboutBlockParagraph.style.right = "0";
}


const handleRegistrationClick = () => {
    hideAboutBlock();

    registrationSlide.style.top = "50%";
    authorizationSlide.style.top = "150vh";
}

const handleAuthorizationClick = () => {
    hideAboutBlock();

    authorizationSlide.style.top = "50%";
    registrationSlide.style.top = "150vh";
}

const handleCloseActionForm = () => {
    authorizationSlide.style.top = "150vh";
    registrationSlide.style.top = "150vh";

    reverseAboutBlock();
}

// const handleToggleHiddenBlock = () => {
//     if (authorizationHiddenBlockIsVisible) {
//         hidden.style.opacity = "0";
//         hidden.style.height = "0";
//         return authorizationHiddenBlockIsVisible = false;
//     }

//     hidden.style.opacity = "1";
//     hidden.style.height = "auto";
//     authorizationHiddenBlockIsVisible = true;
// }
