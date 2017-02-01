import React from 'react';
import Relay from 'react-relay';

import {Card} from 'react-native-material-ui';

import ListItem from '../list/item';


const TagPreview = ({tag, onRemove, onNavigate}) =>
	<Card
		onPress={() => onNavigate (tag.id)}>

		<ListItem
			text={tag.name}
			onRemove={onRemove ? () => onRemove (tag) : null}/>
	</Card>


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
