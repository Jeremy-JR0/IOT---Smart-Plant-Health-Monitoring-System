const poolData = {
    // Need to replace with actual credentials from user pool in AWS
    UserPoolId: abcd,
    ClientId: abc  
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function signUp(){
    // Get required values for signing up
    const username = document.getElementById('username').values;
    const password = document.getElementById('password').values;
    const email = document.getElementById('email').values;

    const attributeList = [new AmazonCognitoIdentity.CognitoUserAttribute({Name: 'email', Value: email})]; // Set the email as an attribute

    // Will validate sign up and check for any errors
    userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err){
            alert(err.message || JSON.stringify(err));
            return;
        }
        alert('Sign up successful! Plese check your email for verification.');
        window.location.href = 'login.html'; // Redirect to Login page
    });

}