let yt_signed_in = false;
let tw_signed_in = false;
const ID = encodeURIComponent(
    "1043280135218-02upes0eher3ifhiuvkc35216gv76sa6.apps.googleusercontent.com"
);

function make_endpoint() {
    let endpoint_url = `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${ID}
&response_type=id_token
&redirect_uri=${encodeURIComponent(
        "https://oohclafeiinckkdnpdgdilnfdgfoaibk.chromiumapp.org"
    )}
&scope=openid
&state=${encodeURIComponent(
        "meet" + Math.random().toString(36).substring(2, 15)
    )}
&nonce=${encodeURIComponent(
        Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
    )}
&prompt=consent`;

    console.log(endpoint_url);
    return endpoint_url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "yt_login") {
        if (yt_signed_in) {
            console.log("Already logged in to youtube");
            return false;
        }
        function redirect(redirect_url) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError);
                return false;
            }
            let id_token = redirect_url.substring(
                redirect_url.indexOf("id_token=") + 9
            );
            id_token = id_token.substring(0, id_token.indexOf("&"));
            const user_info = KJUR.jws.JWS.readSafeJSONString(
                b64utoutf8(id_token.split(".")[1])
            );

            if (
                (user_info.iss === "https://accounts.google.com" ||
                    user_info.iss === "accounts.google.com") &&
                user_info.aud === ID
            ) {
                console.log("User successfully signed in.");
                yt_signed_in = true;
            } else {
                console.log("Invalid credentials.");
            }
        }
        chrome.identity.launchWebAuthFlow(
            {
                url: make_endpoint(),
                interactive: true,
            },
            redirect
        );
        return true;
    } else if (request.message === "yt_logout") {
        yt_signed_in = false;
        console.log("logged out");
    } else if (request.message === "is_yt_in") {
        sendResponse(yt_signed_in);
    }
});
