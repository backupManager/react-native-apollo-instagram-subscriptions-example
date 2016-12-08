import React from 'react'
import Post from './Post'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { ScrollView, View, Text, Button } from 'react-native'
import { withRouter } from 'react-router-native';

class ListPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    router: React.PropTypes.object,
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      if (this.subscription) {
        if (newProps.data.allPosts !== this.props.data.allPosts) {
          // if the feed has changed, we need to unsubscribe before resubscribing
          this.subscription();
        } else {
          // we already have an active subscription with the right params
          return;
        }
      }
      this.subscription = newProps.data.subscribeToMore({
        document: SubscriptionQuery,
        variables: null,

        // this is where the magic happens.
        updateQuery: (previousState, { subscriptionData }) => {
          const newEntry = subscriptionData.data.createPost;

          return {
            allPosts: [
              ...previousState.allPosts,
              {
                ...newEntry
              }
            ]
          }
        },
        onError: (err) => console.error(err),
      });
    }
  }

  render () {
    if (this.props.data.loading) {
      return (<Text>Loading</Text>)
    }

    if (this.props.data.allPosts === undefined) {
      throw new Error('Please specify a correct Graphcool endpoint in the src/root.js')
    }

    return (
      <View>
        <ScrollView>
          <View
            style={
              {
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              }
            }
          >
              {this.props.data.allPosts.reverse().map((post) =>
                <Post key={post.id} post={post} />
              )}
          </View>
        </ScrollView>
        <Button
          onPress={this.createPost}
          title="Create Post"
        />
      </View>
    )
  }

  createPost = () => {
    this.props.router.push('/create');
  }
}

const FeedQuery = gql`query { allPosts { id imageUrl description } }`

const SubscriptionQuery = gql`
  subscription {
    createPost {
      id
      imageUrl
      description
    }
  }
`;

const ListPageWithData = graphql(FeedQuery)(ListPage)

export default withRouter(ListPageWithData)
