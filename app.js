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
      riskCriteria: { label: 'risk', reqPoints: 'Moderate', metCriteria: false },
      problemPointsCategories: problemPointsData,
      dataPointsCategories: dataPointsData,
      riskCategories: riskPointsDataModerate,
      codeCriteria: moderateComplexityCriteria, 
      tabIndex: 0,
      complexity: 'moderate'
    },
    computed: {
      buttonsOrientation: function() {
        if (window.matchMedia( "(min-width: 510px)" ).matches ) {
          return "btn-group"
        } else {
          return "btn-group-vertical"
        }
      }
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
      }
    },
    // uptdate category criteria everytime codeCriteria changes, computed function was having difficulty with reactivity.
    watch: {
      codeCriteria: function(newCriteria) {
        this.problemCriteria.reqPoints = newCriteria.problemPoints
        this.dataCriteria.reqPoints = newCriteria.dataPoints
        this.riskCriteria.reqPoints = newCriteria.risk
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
      changeComplexity(complexity) {
          this.complexity = complexity
        if (complexity == 'moderate') {
          console.log('moderate')
          this.riskCategories = riskPointsDataModerate
          this.codeCriteria = moderateComplexityCriteria
        } else if (complexity == 'high') {
          console.log('high')
          this.riskCategories = riskPointsDataHigh
          this.codeCriteria = highComplexityCriteria
        }
      },
      // Switch active state complexity buttons to mimick radio style buttons. Only one active at a time
      getBtnState(btn) {
        if (this.complexity == btn) {
          return 'active'
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

var riskPointsDataModerate = [
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

var riskPointsDataHigh = [
{
  category: 'One or more chronic illness, with severe exacerbation or progression',
  points: 1,
  instancePoints: 0
},
{
  category: 'Acute or chronic illness or injury, which poses a threat to life or bodily function, e.g., multiple trauma, acute MI, pulmonary embolism, severe respiratory distress, progressive severe rheumatoid arthritis, psychiatric illness, with potential threat to self or others, peritonitis, ARF',
  points: 1,
  instancePoints: 0
},
{
  category: 'An abrupt change in neurological status, e.g., seizure, TIA, weakness, sensory loss',
  points: 1,
  instancePoints: 0
},
{
  category: 'Parenteral controlled substances',
  points: 1,
  instancePoints: 0
},
{
  category: 'Drug therapy requiring intensive monitoring for toxicity',
  points: 1,
  instancePoints: 0
},
{
  category: 'Decision not to resuscitate, or to de-escalate care because of poor prognosis',
  points: 1,
  instancePoints: 0
}]

var moderateComplexityCriteria = {
  problemPoints: 3,
  dataPoints: 3,
  risk: "Moderate",
  catRequired: 2
}

var highComplexityCriteria = {
  problemPoints: 4,
  dataPoints: 4,
  risk: "High",
  catRequired: 2
}

