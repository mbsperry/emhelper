window.onload=function() {

  var vm = new Vue({
    el: '#app',
    data: {
      points: 0,                        // Tracks points for each category
      fields: ['category', 'points'],   // Only show these fields
      problemPoints: problemPointsData,
      dataPoints: dataPointsData,
      codeCriteria: moderateComplexityCriteria, 
      metProbCriteria: false,           // Toggle the color on the indicator table
      metDataCriteria: false,
      metRiskCriteria: false,
      tableCollapse: true,
    },
    methods: {
      addPoints(record, index) {
        record.instancePoints = record.instancePoints + record.points
          if (record.instancePoints <= record.allowedPoints) {
            this.points = this.points + record.points
              if (this.points >= this.codeCriteria.problemPoints) {
                this.metProbCriteria = true
              }
          }
      },

      dataClick() {
        this.problemPoints = dataPointsData
      }
    }
  })
}

/* ************** Data ****************** */

problemPointsData = [
{
  category: 'Self-limited or minor (max 2)',
  points: 1,
  instancePoints: 0,
  allowedPoints: 2
},
{
  category: 'Established problem, stable or improving',
  points: 1,
  instancePoints: 0,
  allowedPoints: 5
},
{
  category: 'Established problem, worsening',
  points: 2,
  instancePoints: 0,
  allowedPoints: 5
},
{
  category: 'New problem, with no additional work-up planned (max 1)',
  points: 3,
  instancePoints: 0,
  allowedPoints: 3
},
{
  category: 'New problem, with additional work-up planned',
  points: 4,
  instancePoints: 0,
  allowedPoints: 5
}]

var dataPointsData = [
{
  category: "Review or order clinic lab tests",
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review or order radiology test',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review or order medicine test (PFTs, EKG, echo)',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Discuss with performing physician',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Independent review of image, tracing, specimen',
  points: 2,
  instancePoints: 0,
  allowedPoints: 2
},
{
  category: 'Decision to obtain old records',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review and summation of old records',
  points: 2,
  instancePoints: 0,
  allowedPoints: 2
}]

var moderateComplexityCriteria = {
  problemPoints: 3,
  dataPoints: 3,
  risk: "Moderate",
  catRequired: 2
}
