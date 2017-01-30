import React from 'react';
import Relay from 'react-relay';

import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native';


const styles = StyleSheet.create ({
	container: {
		height: 70
	},
	primaryText: {
		fontSize: 20
	},
	closeContainer: {
		justifyContent: 'center',
		marginRight: -20,
		padding: 25,
		paddingLeft: 30,
		paddingRight: 30,
		backgroundColor: '#F7F7F7'
	},
	close: {
		color: 'red',
		fontSize: 20
	}
})


import {Button, Card, ListItem} from 'react-native-material-ui';

const RemoveButton = ({onRemove}) =>
	<TouchableOpacity
		style={styles.closeContainer}
		onPress={onRemove}>
		<Text style={styles.close}>&times;</Text>
	</TouchableOpacity>


const TagPreview = ((props) => {
	const {tag: item} = props;

	return (
		<Card
			onPress={() => props.onNavigate (item.id)}>

			<ListItem
				centerElement={{
					primaryText: item.name
				}}
				rightElement={
					<RemoveButton
						onRemove={() => props.onRemove (item)}/>
				}
				style={{
					container: styles.container,
					primaryText: styles.primaryText
				}}/>
		</Card>
	);
});

export default Relay.createContainer (TagPreview, {

	fragments: {
		tag: () => Relay.QL`
			fragment on Tag {
				id
				name
			}
		`
	}
});
