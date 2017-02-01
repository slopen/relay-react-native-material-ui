import React, {PropTypes} from 'react';
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';


import {
	ScrollView,
	View
} from 'react-native';

import {Button} from 'react-native-material-ui';

import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import Loader from '../loader';
import ScrollableList  from '../list';
import ItemPreview from './preview';

import RelayStore from '../../../store';
import ItemRemoveMutation from '../../../mutations/item/remove';
import ItemCreateMutation from '../../../mutations/item/create';


class ItemsListComponent extends ScrollableList {

	static contextTypes = {
		uiTheme: PropTypes.object.isRequired
	}

	getItems = () => this.props.viewer.items

	onItemNavigate = (id) => {
		this.props.router.push ('/item/' + id);
	}

	onItemRemove = (item) => {
		const {viewer} = this.props;

		RelayStore.commitUpdate (
			new ItemRemoveMutation ({
				item: item,
				viewer: viewer
			})
		);

	}

	onItemAdd = () => {
		const {viewer} = this.props;

		RelayStore.commitUpdate (
			new ItemCreateMutation ({
				name: 'new item',
				content: 'new item content',
				viewer: viewer
			})
		);

	}

	render () {
		const {items} = this.props.viewer;
		const {
			onItemNavigate,
			onItemRemove,
			onItemAdd,
			onScroll
		} = this;

		const {uiTheme} = this.context;

		return (
			<ScrollView
				onScroll={onScroll}
				automaticallyAdjustContentInsets={false}
				scrollEventThrottle={250}>

				<View>
					<Button
						raised
						primary
						onPress={onItemAdd}
						style={uiTheme.button}
						icon="add"
						text="ADD"/>
				</View>

				{items.edges.map (({node}) => (
					<ItemPreview
						item={node}
						onNavigate={onItemNavigate}
						onRemove={onItemRemove}
						key={node.id}/>
				))}

				<Loader
					display={this.state.loading}/>

			</ScrollView>
		);
	}
}


const ItemsList = withRouter ((props) =>
	<ItemsListComponent {...props}/>
);


export default createRenderer (ItemsList, {

	queries: ViewerQuery,

	initialVariables: {
		first: ScrollableList.limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {
				id,
				items (first: $first){
					edges {
						node {
							id,
							${ItemPreview.getFragment ('item')}
						}
					}
					total
					pageInfo {
						hasNextPage
					}
				}
			}
		`
	}
});
