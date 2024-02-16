module.exports = Object.freeze({
    loginButton1: '[data-testid="loginButton"]',
    // alt login buttons
    loginButton2: '[data-testid="login"]', 
    loginButton3: '[data-testid="logInSignUpFooter"]',
    loginButton4: '[href="/login"]',
    username: '[autocomplete="username"]',
    tHandle: '[data-testid="ocfEnterTextTextInput"]',
    tHandleNextBtn: '[data-testid="ocfEnterTextNextButton"]',
    nextButton: "[tabindex='0'][role='button']:nth-child(6)",
    altNextButton: '[data-testid="ocfEnterTextNextButton"]',
    altAltNextButton: '[data-testid="LoginForm_Login_Button"]',
    password: '[type="password"]',
    tweetButton: '[aria-label="Tweet"]',
    followerLink: (accountHandle, tab="following") => `[href="/${accountHandle}/${tab}"]`,
    followerContainer: (tab="following") => `[aria-label="Timeline: ${tab}"]>div`,
    follower: (tab="following") => `[aria-label="Timeline: ${tab}"]>div>div`,
    protectedAccount: `[data-testid="emptyState"]`
})