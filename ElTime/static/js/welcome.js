const components = {
    header: document.getElementById("header"),
    about: document.getElementById("about"),
    registration: document.getElementById("registration"),
    authorization: document.getElementById("authorization"),
}

const componentsDisplayingStates = {
    header: true,
    about: true,
    registration: false,
    authorization: false,
};

const aboutHeader = about.getElementsByTagName("h1")[0];
const aboutParagraph = about.getElementsByTagName("p")[0];


const toggleAbout = () => {
    if (componentsDisplayingStates.about) {
        aboutHeader.style.position = "fixed";
        aboutParagraph.style.position = "fixed";
        
        aboutHeader.style.left = "-300%";
        aboutParagraph.style.right = "-300%";
        aboutParagraph.style.width = "700px";

        return componentsDisplayingStates.about = false;
    }

    aboutHeader.style.position = "relative";
    aboutParagraph.style.position = "relative";

    aboutHeader.style.left = "0";
    aboutParagraph.style.right = "0";
    aboutParagraph.style.width = "auto";

    componentsDisplayingStates.about = true;
}

const toggleHeader = () => {
    if (componentsDisplayingStates.header) {
        components.header.style.top = "-80px";

        return componentsDisplayingStates.header = false;
    }
    
    components.header.style.top = "0";
    componentsDisplayingStates.header = true;
}

const toggleActionForm = () => {
    toggleHeader();
    toggleAbout();
}


const handleRegistrationClick = () => {
    toggleActionForm();

    components.registration.style.top = "50%";
    components.authorization.style.top = "150vh";
}

const handleAuthorizationClick = () => {
    toggleActionForm();

    components.registration.style.top = "150vh";
    components.authorization.style.top = "50%";
}

const handleCloseActionForm = () => {
    components.registration.style.top = "150vh";
    components.authorization.style.top = "150vh";

    toggleActionForm();
}
