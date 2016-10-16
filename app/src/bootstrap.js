import { install as offlineInstall } from 'offline-plugin/runtime';
import { onLoad } from './app';
import { _on } from './utils/functions';

const bootstrap = () => {
	_on(window, 'load', onLoad);
	_on(window, 'hashchange', onLoad);

	if (process.env.NODE_ENV === 'production') {
		offlineInstall();
	}
};

// This part only if using 'hot' mode for webpack
// Thanks to Eric Clemmons: https://github.com/ericclemmons/webpack-hot-server-example
const reloading = document.readyState === 'complete';
if (module.hot) {
  module.hot.accept((err) => {
		console.log('❌  HMR Error:', err);
	});

  if (reloading) {
    console.log('🔁  HMR Reloading.');
    onLoad();
  } else {
    console.info('✅  HMR Enabled.');
    bootstrap();
  }

} else {
  console.info('❌  HMR Not Supported.');
  bootstrap();
}
