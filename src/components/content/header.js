import React from 'react';
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {Toolbar, Button} from 'react-native-material-ui';

import ViewerQuery from '../../queries/viewer-query';
import {createRenderer} from '../../lib/relay-utils';


const AppHeader = withRouter ((props) => {
	const {viewer, location} = props;

	const {pathname} = location;

	const currentType = pathname.match (/tag/) ? 'tags' : 'items';
	const switchType = currentType === 'tags' ? 'items' : 'tags';

	const handleLeftButtonPress = () => {
		props.router.goBack ();
	};
	const handleRightButtonPress = () => {
		props.router.push ('/' + switchType);
	};


	return (
		<Toolbar
			leftElement={props.scenes.length > 1 ? 'arrow-back' : null}
			onLeftElementPress={handleLeftButtonPress}
			centerElement={currentType + ' ' + viewer [currentType].total}
			rightElement={
				<Button
					style={{text: {color: '#FFF'}}}
					onPress={handleRightButtonPress}
					text={switchType + ' ' + viewer [switchType].total}/>
			}/>
	);
});

export default createRenderer (AppHeader, {

	queries: ViewerQuery,

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				items (first: 1) {
					total
				}
				tags (first: 1) {
					total
				}
			}
		`
	}
});