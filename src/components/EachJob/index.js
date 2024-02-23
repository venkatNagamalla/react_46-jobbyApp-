import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Headers from '../Headers'
import './index.css'
import SimilarJobs from '../SimilarJobs'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class EachJob extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobsData: {}}

  componentDidMount() {
    this.getEachJobDetails()
  }

  getModifiedData = obj => ({
    companyLogoUrl: obj.company_logo_url,
    companyWebsiteUrl: obj.company_website_url,
    employmentType: obj.employment_type,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    rating: obj.rating,
    id: obj.id,
    title: obj.title,
  })

  getEachJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const jobApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        jobDetails: this.getModifiedData(data.job_details),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        similarJobs: data.similar_jobs.map(eachJob =>
          this.getModifiedData(eachJob),
        ),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="each-job-loader-container">
      <Loader type="ThreeDots" height={50} width={50} color="#ffffff" />
    </div>
  )

  renderEachJobFailure = () => (
    <div className="each-job-failure-container">
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
        onClick={() => this.getEachJobDetails()}
        className="retry-button"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderSkills = skills => (
    <ul className="skills-container">
      {skills.map(eachSkill => (
        <li key={eachSkill.name} className="each-skill">
          <img
            className="skill-img"
            src={eachSkill.imageUrl}
            alt={eachSkill.name}
          />
          <p className="skill-name">{eachSkill.name}</p>
        </li>
      ))}
    </ul>
  )

  renderSimilarJobs = similarJobs => (
    <>
      <h1 className="similar-jobs-heading">Similar Jobs</h1>
      <ul className="similar-jobs-container">
        {similarJobs.map(eachJob => (
          <SimilarJobs key={eachJob.id} similarJobDetails={eachJob} />
        ))}
      </ul>
    </>
  )

  renderLifeAtCompany = lifeAtCompany => {
    const {imageUrl, description} = lifeAtCompany
    return (
      <div className="desc-container">
        <p className="company-desc">{description}</p>
        <img className="company-img" src={imageUrl} alt="life at company" />
      </div>
    )
  }

  renderEachJobCard = jobsData => {
    const {jobDetails, skills, lifeAtCompany} = jobsData
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      companyWebsiteUrl,
      rating,
      title,
    } = jobDetails
    return (
      <div className="job-card">
        <div className="logo-title-container">
          <img
            className="logo"
            src={companyLogoUrl}
            alt="job details company logo"
          />
          <div className="title-rating-container">
            <h1 className="title">{title}</h1>
            <div className="rating-container">
              <FaStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-emp-package-container">
          <div className="location-emp-container">
            <div className="job-card-icon-container">
              <IoLocationSharp className="job-card-icon" />
              <p className="job-card-icon-desc">{location}</p>
            </div>
            <div className="job-card-icon-container">
              <BsBriefcaseFill className="job-card-icon" />
              <p className="job-card-icon-desc">{employmentType}</p>
            </div>
          </div>
          <p className="package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="link-desc-container">
          <h1 className="desc-side-heading">Description</h1>
          <a
            className="visit-link"
            href={companyWebsiteUrl}
            rel="noreferrer"
            target="_blank"
          >
            Visit <FaExternalLinkAlt className="link-icon" />
          </a>
        </div>
        <p className="job-card-desc">{jobDescription}</p>
        <h1 className="side-heading">Skills</h1>
        {this.renderSkills(skills)}
        <h1 className="side-heading">Life at Company</h1>
        {this.renderLifeAtCompany(lifeAtCompany)}
      </div>
    )
  }

  renderEachJobSuccess = () => {
    const {jobsData} = this.state

    return (
      <div className="each-job-inner-container">
        {this.renderEachJobCard(jobsData)}
        {this.renderSimilarJobs(jobsData.similarJobs)}
      </div>
    )
  }

  renderSwitchStatements = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderEachJobFailure()
      case apiStatusConstants.success:
        return this.renderEachJobSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Headers />
        <div className="each-job-container">
          {this.renderSwitchStatements()}
        </div>
      </>
    )
  }
}

export default EachJob
