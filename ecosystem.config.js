module.exports = {
  apps: [
    {
      name: 'game-dice-be',
      script: 'dist/main.js',
      // autorestart: true,
      // watch: ['dist'],
      instances: 3,
      env: {
        NODE_ENV: 'development',
        PORT: 9991,
      },
    },
  ],
};
