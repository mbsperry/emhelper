window.onload=function() {

  Vue.component('main-table', {
    template: '#main-table-template',
    props: ['categoryData', 'categoryCriteria'],
    data: function() {
      return {
        points: 0
      }
    },
    methods: {
      addPoints(selection) {
        // Only require one selection to meet risk criteria
        if (this.categoryCriteria.label == 'risk') {
          selection.instancePoints += 1
          this.$emit('metcriteria', this.categoryCriteria.label)
        } else {
          // For problems and data need to check to see how many we need
          selection.instancePoints = selection.instancePoints + selection.points
            if (selection.instancePoints <= selection.allowedPoints) {
              this.points = this.points + selection.points
                if (this.points >= this.categoryCriteria.reqPoints ) {
                  this.$emit('metcriteria', this.categoryCriteria.label)
                }
            }
        }
      },
      setRowBackground(index, selection) {
        if (selection.instancePoints > 0) {
          return "list-yellow"
        } else {
          return (index & 1) ? "list-gray" : false
        }
      }
    }
  })

  var vm = new Vue({
    el: '#app',
    data: {
      problemCriteria: '',
      dataCriteria: '',
      riskCriteria: '',
      problemPointsCategories: problemPointsData,
      dataPointsCategories: dataPointsData,
      riskCategories: riskPointsData,
      codeCriteria: moderateComplexityCriteria, 
      tabIndex: 0
    },
    // Assign these variables after creation because need to be set after codeCriteria is set
    created: function() {
      this.problemCriteria = { 
        label: 'problems',
        reqPoints: this.codeCriteria.problemPoints,
        metCriteria: false
      }
      this.dataCriteria = {
        label: 'data',
        reqPoints: this.codeCriteria.dataPoints, 
        metCriteria: false 
      },
      this.riskCriteria = {
        label: 'risk',
        reqPoints: this.codeCriteria.risk,
        metCriteria: false
      }
    },
    methods: {
      metCriteria(categoryLabel) {
        if ( categoryLabel == 'problems' ) {
          this.problemCriteria.metCriteria = true
        } else if ( categoryLabel == 'data' ) {
          this.dataCriteria.metCriteria = true
        } else if ( categoryLabel == 'risk' ) {
          this.riskCriteria.metCriteria = true
        }
      },
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
      setRowBackground(index, record) {
        if (record.instancePoints > 0) {
          return "list-yellow"
        } else {
          return (index & 1) ? "list-gray" : false
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
  points: 1,
  instancePoints:0
},
{
  category: "Two or more stable chronic illnesses",
  points: 1,
  instancePoints:0
},
{
  category: "Undiagnosed new problem, with uncertain prognosis, e.g., lump in breast",
  points: 1
},
{
  category: 'Acute illness, with systemic symptoms',
  points: 1,
  instancePoints:0
},
{
  category: 'Acute complicated injury, e.g., head injury, with brief loss of consciousness',
  points: 1,
  instancePoints:0
},
{
  category: 'Physiologic tests under stress, e.g., cardiac stress test, fetal contraction stress test',
  points: 1,
  instancePoints:0
},
{
  category: 'Prescription drug management',
  points: 1,
  instancePoints:0
},
{
  category: 'IV fluids, with additives',
  points: 1,
  instancePoints:0
},
{
  category: 'Closed treatment of fracture or dislocation, without manipulation',
  points: 1,
  instancePoints:0
}]



var moderateComplexityCriteria = {
  problemPoints: 3,
  dataPoints: 3,
  risk: "Moderate",
  catRequired: 2
}
