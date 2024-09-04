const poolData = {
    // Need to replace with actual credentials from user pool in AWS
    UserPoolId: abcd,
    ClientId: abc  
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function login(){
    const username = document.getElementById('username').values;
    const password = document.getElementById('password').values;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
    });

    const userData = {
        Username: username,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSucess: function(result) { 
            alert('Login successful!');
            window.location.href = 'index.html';
        },
        onFailure: function(err){
            alert(err.message || JSON.stringify(err));
        }
    });
}