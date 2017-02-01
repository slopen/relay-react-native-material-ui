import React, {Component, PropTypes} from 'react'
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {
	View,
	TextInput,
	StyleSheet,
	ScrollView
} from 'react-native';


import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import RelayStore from '../../../store';

import TagPreview from '../tag/preview';

import UpdateItemMutation from '../../../mutations/item/update';
import LinkMutation from '../../../mutations/link';
import UnlinkMutation from '../../../mutations/unlink';

import {Card, Button, Subheader} from 'react-native-material-ui';

import AddTagDialog from './dialog';

const styles = StyleSheet.create ({
	input: {
		height: 70,
		fontSize: 20,
		color: '#777',
		padding: 20
	},
	controls: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 12
	}
})

styles.button = StyleSheet.create ({
	container: {
		flex: 0.5,
		margin: 8
	}
});


const limit = 20;

const InputForm = ({
	name,
	content,
	onChangeName,
	onChangeContent
}) =>
	<View>
		<TextInput
			underlineColorAndroid="transparent"
			style={styles.input}
			placeholder="item name"
			value={name}
			onChangeText={onChangeName}/>

		<TextInput
			underlineColorAndroid="transparent"
			style={styles.input}
			multiline={true}
			numberOfLines={4}
			placeholder="item content"
			value={content}
			onChangeText={onChangeContent}/>
	</View>


const Controls = ({onTagAdd, onSave}) =>
	<View
		style={styles.controls}>
		<Button
			raised
			primary
			onPress={onTagAdd}
			style={styles.button}
			icon="add"
			text="ADD TAG"/>

		<Button
			raised
			primary
			onPress={onSave}
			style={styles.button}
			icon="save"
			text="SAVE"/>
	</View>


class ItemPreview extends Component {

	static contextTypes = {
		uiTheme: PropTypes.object.isRequired
	}

	constructor (props) {
		const {name, content, tags} = props.viewer.item;

		super (props);

		this.state = {name, content, tags, addTag: false};
	}

	onTagRemove = (tag) => {
		const {item} = this.props.viewer;

		RelayStore.commitUpdate (
			new UnlinkMutation ({item, tag})
		);
	}

	onTagAdd = (id) => {
		const {item, tags} = this.props.viewer;
		const {node: tag} = tags.edges.find (
			({node}) => node.id === id
		);

		RelayStore.commitUpdate (
			new LinkMutation ({item, tag})
		);
	}

	onTagNavigate = (id) => {
		this.props.router.push ('/tag/' + id);
	}

	onSave = () => {
		const {item} = this.props.viewer;
		const {name, content} = this.state;

		RelayStore.commitUpdate (
			new UpdateItemMutation ({item, name, content})
		);
	}

	render () {
		const {item, tags} = this.props.viewer;
		const {tags: itemTags} = item;

		const {content, name} = this.state;

		const {onTagRemove, onTagAdd, onTagNavigate, onSave} = this;

		return (
			<View>
				<ScrollView
					automaticallyAdjustContentInsets={false}
					scrollEventThrottle={200}>

					<Card>
						<Subheader text={name}/>

						<InputForm
							name={name}
							content={content}
							onChangeName={(name) => this.setState ({name})}
							onChangeContent={(content) => this.setState ({content})}/>

						{itemTags.edges.map (({node}) =>
							<TagPreview
								onNavigate={onTagNavigate}
								onRemove={onTagRemove}
								tag={node}
								key={node.id}/>
						)}

						<Controls
							onSave={onSave}
							onTagAdd={() => this.setState ({
								addTag: true
							})}/>
					</Card>
				</ScrollView>

				<AddTagDialog
					item={item}
					tags={tags}
					open={this.state.addTag}
					onAdd={onTagAdd}
					onDismiss={() => this.setState ({
						addTag: false
					})}/>

			</View>
		);
	}

}

const ItemView = withRouter ((props) =>
	<ItemPreview {...props}/>
);

export default createRenderer (ItemView, {

	queries: ViewerQuery,

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				item (id: $id) {
					id,
					name,
					content,

					tags (first: $limit){
						edges {
							node {
								id
								${TagPreview.getFragment ('tag')}
							}
						}
					}

				}

				tags (first: 20) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`
	}
})