import './index.css'

const FiltersGroup = props => {
  const {employmentTypesList, salaryRangesList} = props

  const renderEmploymentList = () => {
    const {getEmploymentType} = props

    return (
      <ul className="filter-container">
        {employmentTypesList.map(emp => {
          const isCheckBoxChecked = event => {
            getEmploymentType(event.target.value)
          }

          return (
            <li key={emp.employmentTypeId} className="filter-input-container">
              <input
                onChange={isCheckBoxChecked}
                className="input"
                type="checkbox"
                id={emp.employmentTypeId}
                value={emp.employmentTypeId}
              />
              <label className="label" htmlFor={emp.employmentTypeId}>
                {emp.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderSalaryRange = () => {
    const {getSalaryRange} = props
    return (
      <ul className="filter-container">
        {salaryRangesList.map(eachOne => {
          const salary = event => {
            getSalaryRange(event.target.value)
          }

          return (
            <li key={eachOne.salaryRangeId} className="filter-input-container">
              <input
                className="input"
                onChange={salary}
                id={eachOne.salaryRangeId}
                type="radio"
                name="salary"
                value={eachOne.salaryRangeId}
              />
              <label className="label" htmlFor={eachOne.salaryRangeId}>
                {eachOne.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="filters-page-container">
      <hr />
      <h1 className="filter-heading">Type of Employment</h1>
      {renderEmploymentList()}
      <hr />
      <h1 className="filter-heading">Salary Range</h1>
      {renderSalaryRange()}
    </div>
  )
}

export default FiltersGroup
