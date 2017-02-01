import React from 'react';
import Relay from 'react-relay';

import {Card} from 'react-native-material-ui';

import ListItem from '../list/item';


const ItemPreview = ({item, onRemove, onNavigate}) =>
	<Card
		onPress={() => onNavigate (item.id)}>

		<ListItem
			text={item.name}
			onRemove={() => onRemove (item)}/>
	</Card>

export default Relay.createContainer (ItemPreview, {

	fragments: {
		item: () => Relay.QL`
			fragment on Item {
				id
				name
			}
		`
	}
})