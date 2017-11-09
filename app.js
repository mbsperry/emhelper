window.onload=function() {

  var vm = new Vue({
    el: '#app',
    data: {
      problemPoints: '',
      dataPoints: '',
      riskPoints: '',
      fields: ['category', 'points'],   // Only show these fields
      riskFields: ['category'],
      problemPointsCategories: problemPointsData,
      dataPointsCategories: dataPointsData,
      riskPointsCategories: riskPointsData,
      codeCriteria: moderateComplexityCriteria, 
      tabIndex: 0
    },
    // Assign these variables after creation because need to be set after codeCriteria is set
    created: function() {
      this.problemPoints = { 
        points: 0, 
        reqPoints: this.codeCriteria.problemPoints,
        metCriteria: false 
      }
      this.dataPoints = {
        points: 0, 
        reqPoints: this.codeCriteria.dataPoints, 
        metCriteria: false 
      },
      this.riskPoints = {
        reqPoints: this.codeCriteria.risk,
        metCriteria: false
      }
    },
    methods: {
      addPoints(record, catPoints) {
        if (this.tabIndex == 2) {
          this.riskPoints.metCriteria = true
        } else {
          record.instancePoints = record.instancePoints + record.points
            if (record.instancePoints <= record.allowedPoints) {
              catPoints.points = catPoints.points + record.points
                if (catPoints.points >= catPoints.reqPoints ) {
                  catPoints.metCriteria = true
                }
            }
        }
      },
      isOddRow(num) {
        return (num & 1) ? "list-gray" : false
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

var riskPointsData = [
{
  category: "One or more chronic illness, with mild exacerbation, progression, or side effects of treatment",
  points: 1
},
{
  category: "Two or more stable chronic illnesses",
  points: 1
},
{
  category: "Undiagnosed new problem, with uncertain prognosis, e.g., lump in breast",
  points: 1
},
{
  category: 'Acute illness, with systemic symptoms',
  points: 1
},
{
  category: 'Acute complicated injury, e.g., head injury, with brief loss of consciousness',
  points: 1
},
{
  category: 'Physiologic tests under stress, e.g., cardiac stress test, fetal contraction stress test',
  points: 1
},
{
  category: 'Prescription drug management',
  points: 1
},
{
  category: 'IV fluids, with additives',
  points: 1
},
{
  category: 'Closed treatment of fracture or dislocation, without manipulation',
  points: 1
}]



var moderateComplexityCriteria = {
  problemPoints: 3,
  dataPoints: 3,
  risk: "Moderate",
  catRequired: 2
}
