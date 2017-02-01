import React, {Component} from 'react'
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {
	ScrollView
} from 'react-native';

import {Card, Subheader} from 'react-native-material-ui';

import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import ItemPreview from '../item/preview';

import RelayStore from '../../../store';
import UnlinkMutation from '../../../mutations/unlink';


const limit = 20;

class TagPreview extends Component {

	onNavigate = (id) => {
		this.props.router.push ('/item/' + id);
	}

	onRemove = (item) => {
		const {tag} = this.props.viewer;

		RelayStore.commitUpdate (
			new UnlinkMutation ({tag, item})
		);
	}

	render () {
		const {tag} = this.props.viewer;
		const {items: tagsItems} = tag;

		const {onNavigate, onRemove} = this;

		return (
			<ScrollView
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={200}>

				<Card>
					<Subheader text={tag.name}/>

					{tagsItems.edges.map (({node}) =>
						<ItemPreview
							onNavigate={onNavigate}
							onRemove={onRemove}
							item={node}
							key={node.id}/>
					)}
				</Card>

			</ScrollView>
		);
	}

}

const TagView = withRouter ((props) =>
	<TagPreview {...props}/>
);

export default createRenderer (TagView, {

	queries: ViewerQuery,

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				tag (id: $id) {
					id,
					name

					items (first: $limit){
						edges {
							node {
								id
								${ItemPreview.getFragment ('item')}
							}
						}
					}

				}
			}
		`
	}
});

