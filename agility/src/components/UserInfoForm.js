import React from "react"
import { Button, Form, Dimmer, Loader, Message, Input } from "semantic-ui-react"
import { graphql, compose } from "react-apollo"
import FetchUser from "../queries/fetchUser"
import FetchTeams from "../queries/fetchTeams"
import UpdatePersonById from "../mutations/UpdatePersonById"

class UserInfoForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: "",
      lastName: "",
      pic: "",
      position: "",
      team: "",
      teamLead: false,
      errors: []
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { firstName, lastName, pic, position, team, teamLead } = this.state
    // this.props
    //   .mutate({
    //     variables: { email, password },
    //     refetchQueries: [{ query }]
    //   })
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(res => {
    //     const errors = res.graphQLErrors.map(error => error.message)
    //     this.setState({ errors })
    //   })
  }

  handleChange = (e, data) => {
    this.setState({ team: data.value })
  }

  toggle = () => this.setState({ checked: !this.state.teamLead })

  setDefaultVals = () => {
    this.setState({
      firstName: this.props.user.personById.firstName,
      lastName: this.props.user.personById.lastName,
      pic: this.props.user.personById.userPictureUrl,
      position: this.props.user.personById.position,
      team: this.props.user.personById.teamId,
      teamLead: this.props.user.personById.teamLead
    })
  }

  renderErrors = () => {
    return this.state.errors.map(error => {
      return <Message key={error} error header="Oops!" content={error} />
    })
  }

  render() {
    if (this.props.allTeams.loading || this.props.user.loading) {
      return (
        <Dimmer active inverted>
          <Loader content="Loading" />
        </Dimmer>
      )
    }
    console.log(this.props)
    const options = this.props.allTeams.allTeams.nodes.map(team => {
      return {
        ...team,
        text: team.name,
        value: team.id
      }
    })
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field
          control={Input}
          label="First Name"
          placeholder="First Name"
          defaultValue={this.props.user.personById.firstName}
          value={this.state.firstName}
          onChange={e => this.setState({ firstName: e.target.value })}
        />
        <Form.Input
          label="Last Name"
          placeholder="Last Name"
          value={this.state.lastName}
          onChange={e => this.setState({ lastName: e.target.value })}
        />
        <Form.Input
          label="Profile Picture URL"
          placeholder="www.pictureofme.com"
          value={this.state.pic}
          onChange={e => this.setState({ pic: e.target.value })}
        />
        <Form.Input
          label="Job Title"
          placeholder="Junior Front-End Engineer"
          value={this.state.position}
          onChange={e => this.setState({ position: e.target.value })}
        />
        <Form.Select
          options={options}
          placeholder="Teams"
          value={this.state.team}
          onChange={this.handleChange}
        />
        <Form.Checkbox
          label="I am a Team Lead with Admin Privileges"
          onChange={this.toggle}
          checked={this.state.teamLead}
        />
        {this.renderErrors()}
        <Button type="submit">Submit</Button>
      </Form>
    )
  }
}

export default compose(
  graphql(UpdatePersonById),
  graphql(FetchTeams, { name: "allTeams" }),
  graphql(FetchUser, {
    name: "user",
    options: props => {
      return { variables: { id: parseInt(props.match.params.id) } }
    }
  })
)(UserInfoForm)
// graphql(FetchUser, {
//   options: props => {
//     return { variables: { id: parseInt(props.match.params.id) } }
//   }
// })(graphql(UpdatePersonById)(graphql(FetchTeams)(UserInfoForm)))