// Grab NODE_ENV and environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

// this thing I partially stole from the create-react-app boilerplate

function getClientEnvironment() {
  var processEnv = Object
    .keys(process.env)
    .reduce((env, key) => {
      env[key] = JSON.stringify(process.env[key]);
      return env;
    }, {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      'NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
    });
  return {'process.env': processEnv};
}

module.exports = getClientEnvironment;
