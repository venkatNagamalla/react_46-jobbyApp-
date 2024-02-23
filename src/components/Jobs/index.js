/* eslint-disable jsx-a11y/control-has-associated-label */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard'
import Headers from '../Headers'
import FiltersGroup from '../FiltersGroup'
import './index.css'

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    apiProfileStatus: apiProfileStatusConstants.initial,
    profileData: {},
    apiJobsStatus: apiJobsStatusConstants.initial,
    jobsData: [],
    employmentTypes: [],
    salaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getUserProfile()
    this.getJobsData()
  }

  getEmploymentType = employmentType => {
    this.setState(
      prevState => ({
        employmentTypes: [...prevState.employmentTypes, employmentType],
      }),
      this.getJobsData,
    )
  }

  getSalaryRange = range => {
    this.setState({salaryRange: range}, this.getJobsData)
  }

  getModified = obj => ({
    id: obj.id,
    companyLogoUrl: obj.company_logo_url,
    employmentType: obj.employment_type,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    title: obj.title,
  })

  getJobsData = async () => {
    const {employmentTypes, salaryRange, searchInput} = this.state
    let emp = ''
    if (employmentTypes.length === 0) {
      emp = ''
    } else {
      emp = employmentTypes.join()
    }
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${emp}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, options)
    if (response.ok) {
      const data = await response.json()
      const {jobs} = data
      const filteredData = jobs.map(eachJob => this.getModified(eachJob))
      this.setState({
        jobsData: filteredData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  getUserProfile = async () => {
    this.setState({apiProfileStatus: apiProfileStatusConstants.inProgress})
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedData,
        apiProfileStatus: apiProfileStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConstants.failure})
    }
  }

  getSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchInputResults = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          onKeyDown={this.getSearchInputResults}
          onChange={this.getSearchInput}
          value={searchInput}
          className="search-input"
          type="search"
          placeholder="Search"
        />
        <button
          onClick={() => this.getJobsData()}
          data-testid="searchButton"
          className="search-btn"
          type="button"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderProfile = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img className="profile-image" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" height={50} width={50} color="#ffffff" />
    </div>
  )

  onRetryButtonClick = () => {
    this.getUserProfile()
  }

  renderFailure = () => (
    <div className="failure-container">
      <button
        onClick={this.onRetryButtonClick}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileState = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.inProgress:
        return this.renderLoader()
      case apiProfileStatusConstants.failure:
        return this.renderFailure()
      case apiProfileStatusConstants.success:
        return this.renderProfile()
      default:
        return null
    }
  }

  renderJobs = jobsData => (
    <ul className="all-jobs-container">
      {jobsData.map(eachJob => (
        <JobCard key={eachJob.id} jobDetails={eachJob} />
      ))}
    </ul>
  )

  renderNoJobs = () => (
    <div className="no-job-container">
      <img
        className="no-jobs-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-desc">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobsData} = this.state
    return jobsData.length !== 0
      ? this.renderJobs(jobsData)
      : this.renderNoJobs()
  }

  renderJobsFailure = () => (
    <div className="jobs-failure-container">
      <img
        className="jobs-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        onClick={() => this.getJobsData()}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.inProgress:
        return this.renderLoader()
      case apiJobsStatusConstants.failure:
        return this.renderJobsFailure()
      case apiJobsStatusConstants.success:
        return this.renderJobsSuccess()
      default:
        return null
    }
  }

  render() {
    const {salaryRange} = this.state
    return (
      <>
        <Headers />
        <div className="jobs-container">
          <div className="inner-container">
            <div className="left-container">
              <div className="mobile-search">{this.renderSearchInput()}</div>
              {this.renderProfileState()}
              <FiltersGroup
                getSalaryRange={this.getSalaryRange}
                salaryRange={salaryRange}
                employmentTypesList={employmentTypesList}
                salaryRangesList={salaryRangesList}
                getEmploymentType={this.getEmploymentType}
              />
            </div>
            <div className="right-container">
              <div className="desk-search">{this.renderSearchInput()}</div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
