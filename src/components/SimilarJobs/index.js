import {FaStar} from 'react-icons/fa'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    <li className="similar-job-card">
      <div className="logo-title-container">
        <img
          className="logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="title-rating-container">
          <h1 className="title">{title}</h1>
          <div className="rating-container">
            <FaStar className="star" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="margin-top desc-side-heading">Description</h1>
      <p className="job-card-desc">{jobDescription}</p>
      <div className="margin-top location-emp-container">
        <div className="job-card-icon-container">
          <IoLocationSharp className="job-card-icon" />
          <p className="job-card-icon-desc">{location}</p>
        </div>
        <div className="job-card-icon-container">
          <BsBriefcaseFill className="job-card-icon" />
          <p className="job-card-icon-desc">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
