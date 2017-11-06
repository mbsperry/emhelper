window.onload=function() {

  var vm = new Vue({
    el: '#app',
    data: {
      points: 0,                        // Tracks points for each category
      fields: ['category', 'points'],   // Only show these fields
      problemPoints: problemPointsData,
      codeCriteria: moderateComplexityCriteria, 
      metProbCriteria: false,           // Toggle the color on the indicator table
      metDataCriteria: false,
      metRiskCriteria: false,
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

var moderateComplexityCriteria = {
  problemPoints: 3,
  dataPoints: 3,
  risk: "Moderate",
  catRequired: 2
}
