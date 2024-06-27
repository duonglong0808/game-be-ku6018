module.exports = {
  apps: [
    {
      name: 'game-be-ku6018',
      script: 'dist/main.js',
      // autorestart: true,
      // watch: ['dist'],
      instances: 3,
      env: {
        NODE_ENV: 'development',
        PORT: 9992,
      },
    },
  ],
};
