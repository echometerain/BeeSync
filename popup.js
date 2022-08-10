function onSuccess(googleUser) {
    console.log("Logged in as: " + googleUser.getBasicProfile().getName());
}
function onFailure(error) {
    console.log(error);
}
const g_sign_in = document.getElementById("g_sign_in");
g_sign_in.addEventListener("click", () => {
    chrome.runtime.sendMessage({ message: "login" }, (response) => {
        if (response === "success") window.close();
    });
});
