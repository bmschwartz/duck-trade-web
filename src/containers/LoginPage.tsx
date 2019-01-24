import React from 'react'
import { Mutation } from 'react-apollo'
import { RouteComponentProps } from 'react-router-dom'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

import LOGIN_MUTATION from '../graphql/mutations/login'

interface ILoginFormState {
  username: string
  password: string
}

class LoginForm extends React.Component<RouteComponentProps<{}>, ILoginFormState> {
  
  public state: ILoginFormState = {
    username: '',
    password: '',
  }

  public saveUsername = (e: any) => {
    this.setState({ username: e.target.value });
  };

  public savePassword = (e: any) => {
    this.setState({ password: e.target.value });
  }

  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login, { loading }) => {
          return (
            <div className='login-form'>
              <style>{`
                body > div,
                body > div > div,
                body > div > div > div.login-form {
                  height: 100%;
                }
              `}</style>
              <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                  <Form size='large'>
                    <Segment stacked>
                      <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' value={this.state.username} onChange={this.saveUsername} />
                      <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={this.savePassword}
                        value={this.state.password}
                      />

                      <Button 
                        color='teal'
                        fluid
                        size='large'
                        disabled={loading}
                        onClick={async () => {
                          try {
                            await login({ variables: this.state })
                            this.props.history.push('/')
                          } catch (e) {
                            // do nothing.. gets handled above
                          }
                        }}
                      >
                        Login
                      </Button>
                    </Segment>
                  </Form>
                  <Message>
                    <Header as='h5' textAlign='left'>Usernames: huey, dewey, louie</Header>
                    <Header as='h5' textAlign='left'>Password: password</Header>
                  </Message>
                </Grid.Column>
              </Grid>
            </div>
          )
        }}
      </Mutation>
    )
  }
}

export default LoginForm