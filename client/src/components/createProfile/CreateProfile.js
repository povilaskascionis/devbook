import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputGroup from '../common/InputGroup';
import { createProfile } from '../../actions/profileActions';

import PropTypes from 'prop-types';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displaySocialInputs: false,
      handle: '',
      company: '',
      website: '',
      location: '',
      status: '',
      skills: '',
      githubUsername: '',
      bio: '',
      twitter: '',
      facebook: '',
      linkedin: '',
      youtube: '',
      instagram: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      youtube,
      instagram,
      linkedin
    } = this.state;

    const profileData = {
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      youtube,
      instagram,
      linkedin
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    //select options for status
    const options = [
      { label: '* Select Professional status', value: 0 },
      { label: 'Developer', value: 'Developer' },
      { label: 'Junior Developer', value: 'Junior Developer' },
      { label: 'Senior Developer', value: 'Senior Developer' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Designer', value: 'Designer' },
      { label: 'Student/Learning', value: 'Student/Learning' },
      { label: 'Intern', value: 'Intern' },
      { label: 'Other', value: 'Other' }
    ];

    let socialInputs;

    if (this.state.displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup
            placeholder="Twitter profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            onChange={this.onChange}
            error={this.state.errors.twitter}
          />
          <InputGroup
            placeholder="Facebook profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            onChange={this.onChange}
            error={this.state.errors.facebook}
          />
          <InputGroup
            placeholder="Youtube channel URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            onChange={this.onChange}
            error={this.state.errors.youtube}
          />
          <InputGroup
            placeholder="Linkedin profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            onChange={this.onChange}
            error={this.state.errors.linkedin}
          />
          <InputGroup
            placeholder="Instagram profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            onChange={this.onChange}
            error={this.state.errors.instagram}
          />
        </div>
      );
    }

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's make your profile stand out
              </p>
              <small className="d-block pb-3">
                Fields market with * are required
              </small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  name="handle"
                  placeholder="* Profile handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={this.state.errors.handle}
                  info="A unique handle for your profile URL. Consider it as your nickname"
                />
                <SelectListGroup
                  name="status"
                  placeholder="Status"
                  value={this.state.status}
                  options={options}
                  onChange={this.onChange}
                  error={this.state.errors.status}
                  info="Let others know where you are at your carrer"
                />
                <TextFieldGroup
                  name="company"
                  placeholder="Company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={this.state.errors.company}
                  info="Could be your employer or your own company"
                />
                <TextFieldGroup
                  name="website"
                  placeholder="Website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={this.state.errors.website}
                  info="Your personal or your company's webiste"
                />
                <TextFieldGroup
                  name="location"
                  placeholder="Location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={this.state.errors.location}
                  info="Where are you working from"
                />
                <TextFieldGroup
                  name="skills"
                  placeholder="* Skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={this.state.errors.skills}
                  info="Please use comma separated values (e.g. HTML,Javascript,Golang,Web design,Java)"
                />
                <TextFieldGroup
                  name="githubusername"
                  placeholder="Github Username"
                  value={this.state.githubusername}
                  onChange={this.onChange}
                  error={this.state.errors.githubusername}
                  info="If you want your latest repos to show up on your profile, enter your GitHub username"
                />
                <TextAreaFieldGroup
                  name="bio"
                  placeholder="* Bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={this.state.errors.bio}
                  info="Tell us a few words about yourself"
                />

                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                    className="btn btn-light"
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted"> Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile }
)(withRouter(CreateProfile));
