const registrationSlide = document.getElementById("registration");
const authorizationSlide = document.getElementById("authorization");

const handleRegistrationClick = () => {
    registrationSlide.style.top = "50%";
    registrationSlide.style.transform = "translateY(-50%)";
}

const handleAuthorizationClick = () => {
    authorizationSlide.style.top = "50%";
    authorizationSlide.style.transform = "translateY(-50%)";
}
