window.onload=function() {

  Vue.component('main-table', {
    template: '#main-table-template',
    props: ['categoryData', 'label'],
    data: function() {
      return {
        points: 0
      }
    },
    methods: {
      onClick(selection) {
        // Only require one selection to meet risk criteria
        if (selection.allowedPoints == null) {
          selection.instancePoints += 1
          this.points += 1
          this.$emit('update-points', this.categoryData, this.label)
        } else {
          // For problems and data need to check to see how many we need
            if (selection.instancePoints < selection.allowedPoints) {
              selection.instancePoints += selection.points
              this.points = this.points + selection.points
              this.$emit('update-points', this.categoryData, this.label)
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
      problemPoints: 0,
      dataPoints: 0,
      risk: '',
      problemPointsCategories: problemPointsData,
      dataPointsCategories: dataPointsData,
      riskCategories: riskPointsDataModerate,
      riskLevel: 'moderate'
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
    methods: {
      updatePoints(categoryData, label) {
        var tempPoints = 0 
        /* Loop through add up points */
        for (var i = 0; i < categoryData.length; i++) {
          tempPoints += categoryData[i].instancePoints
        }
        if (label == 'problems' ) {
          this.problemPoints = tempPoints
        } else if (label == 'data' ) {
          this.dataPoints = tempPoints
        } else if (label == 'risk' ) {
          /* Only update risk level if it would bump up to next level
           * never downgrade risk level
           */ 
          if (this.riskLevel == 'low' && tempPoints > 0 && this.risk <= 1) {
            this.risk = 1
          } else if (this.riskLevel == 'moderate' && tempPoints > 0 && this.risk <= 2) {
            this.risk = 2
          } else if (this.riskLevel == 'high' && tempPoints > 0 && this.risk <= 3) {
            this.risk = 3
          }
        }
      },

      changeRisk(riskLevel) {
        this.riskLevel = riskLevel
        if (riskLevel == 'low') {
          this.riskCategories = riskPointsDataLow
        } else if (riskLevel == 'moderate') {
          console.log('moderate')
          this.riskCategories = riskPointsDataModerate
        } else if (riskLevel == 'high') {
          console.log('high')
          this.riskCategories = riskPointsDataHigh
        }
      },

      getBtnState(btn) {
      /* Switch active state complexity buttons to mimick radio style 
       * buttons. Only one active at a time
       */
        if (this.riskLevel == btn) {
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
  points: 1,
  instancePoints: 0
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

var riskPointsDataLow = [
{
  category: 'Two or more self-limited or minor problems',
  points: 1,
  instancePoints: 0
},
{
  category: 'One stable chronic illness, e.g., well controlled HTN, DM2, cataract',
  points: 1,
  instancePoints: 0
},
{
  category: 'Superficial needle biopsy',
  points: 1,
  instancePoints: 0
},
{
  category: 'Over the counter drugs',
  points: 1,
  instancePoints: 0
},
{
  category: 'IV fluids, without additives',
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

