window.onload=function() {

  Vue.component('main-table', {
    // template located in index.html as inline template
    template: '#main-table-template',

    // need reference to data and know what type of data we are working with
    // categoryData is passed as a reference to the globally defined object
    props: ['categoryData', 'label'],

    data: function() {
      return {
        points: 0   // currently tracking points does nothing
      }
    },

    methods: {
      onClick (selection) {
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
          // only return gray for odd rows
          return (index & 1) ? "list-gray" : false
        }
      },

      resetCategory() {
        for (i = 0; i < this.categoryData.length; i++) {
          this.categoryData[i].instancePoints = 0
          this.points = 0
        }
        this.$emit('update-points', this.categoryData, this.label)
      },

      resetAll() {
        for (i = 0; i < problemPointsData.length; i++) {
          problemPointsData[i].instancePoints = 0
        }
        for (i = 0; i < dataPointsData.length; i++) {
          dataPointsData[i].instancePoints = 0
        }
        for (i = 0; i < riskPointsDataLow.length; i++) {
          riskPointsDataLow[i].instancePoints = 0
        }
        for (i = 0; i < riskPointsDataModerate.length; i++) {
          riskPointsDataModerate[i].instancePoints = 0
        }
        for (i = 0; i < riskPointsDataHigh.length; i++) {
          riskPointsDataHigh[i].instancePoints = 0
        }

        this.$emit('update-all')
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
      riskLevel: 'moderate',
      overallComplexity: ''
    },

    computed: {
      // I think this is unused
      buttonsOrientation: function() {
        if (window.matchMedia( "(min-width: 510px)" ).matches ) {
          return "btn-group"
        } else {
          return "btn-group-vertical"
        }
      },

      problemSummarySentence: function() {
      // Iterate through each array and construct the summary sentence
        
        var items = ''
        for (i = 0; i < problemPointsData.length; i++) {
          if (problemPointsData[i].instancePoints > 0) {
            var numItem = problemPointsData[i].instancePoints / problemPointsData[i].points

            if (items === '') {
              items += numItem + ' ' + problemPointsData[i].sentence
            } else {
              items += '; ' + numItem + ' ' +  problemPointsData[i].sentence
            }
          }
        }
        return items
      },

      dataSummarySentence: function() {
        var items = ''
          for (i = 0; i < dataPointsData.length; i++) {
            if (dataPointsData[i].instancePoints > 0) {
              if (items === '') {
                items += dataPointsData[i].sentence
              } else {
                items += '; ' + dataPointsData[i].sentence
              }
            }
          }
        return items
      },

      riskSummarySentence: function() {
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
          } else if (tempPoints == 0) {
            this.risk = 0
          }
        }
        this.computeComplexity()
      },

      updateAll() {
        // Misnomer, this should be reset all
        this.problemPoints = 0
        this.dataPoints = 0
        this.risk = 0
        this.overallComplexity = ''
      },

      computeComplexity() {
        // Each pass runs the meetsCriteria function with a different set of requirements
        // to figure out what complexity current selections meets. Moves in descending
        // order, stop once we find a match

        if (this.meetsCriteria(4, 4, 3)) {
          this.overallComplexity = 'high'
        } else if (this.meetsCriteria(3, 3, 2)) {
          this.overallComplexity = 'moderate'
        } else if (this.meetsCriteria(2, 2, 1)) {
          this.overallComplexity = 'low'
        } else {
          this.overallComplexity = ''
        }
      },

      meetsCriteria(reqProbPoints, reqDataPoints, reqRisk) {
        var catMet = 0

        if (this.problemPoints >= reqProbPoints) {
          catMet += 1
        }
        if (this.dataPoints >= reqDataPoints) {
          catMet += 1
        }
        if (this.risk >= reqRisk) {
          catMet += 1
        }


        // only requires 2 out of three categories to meet criteria
        if (catMet >= 2) {
          return true
        } else {
          return false
        }
      },

      changeRisk(riskLevel) {
        this.riskLevel = riskLevel
        if (riskLevel == 'low') {
          this.riskCategories = riskPointsDataLow
        } else if (riskLevel == 'moderate') {
          this.riskCategories = riskPointsDataModerate
        } else if (riskLevel == 'high') {
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

// Global data

problemPointsData = [
{
  category: 'Self-limited or minor (max 2)',
  sentence: 'minor problem',
  points: 1,
  instancePoints: 0,
  allowedPoints: 2
},
{
  category: 'Established problem, stable or improving',
  sentence: 'stable/improving established problem',
  points: 1,
  instancePoints: 0,
  allowedPoints: 5
},
{
  category: 'Established problem, worsening',
  sentence: 'worsening established problem',
  points: 2,
  instancePoints: 0,
  allowedPoints: 5
},
{
  category: 'New problem, with no additional work-up planned (max 1)',
  sentence: 'new problem without additional work-up planned',
  points: 3,
  instancePoints: 0,
  allowedPoints: 3
},
{
  category: 'New problem, with additional work-up planned',
  sentence: 'new problem with additional work-up planned',
  points: 4,
  instancePoints: 0,
  allowedPoints: 5
}]

var dataPointsData = [
{
  category: "Review or order clinic lab tests",
  sentence: 'clinic lab tests were reviewed or ordered',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review or order radiology test',
  sentence: 'radiology tests were reviewed or ordered',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review or order medicine test (PFTs, EKG, echo)',
  sentence: 'medicine tests were reviewed or ordered',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Discuss with performing physician',
  sentence: 'results were discussed with performing physician',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Independent review of image, tracing, specimen',
  sentence: 'tracing, image, or specimen was independently reviewed',
  points: 2,
  instancePoints: 0,
  allowedPoints: 2
},
{
  category: 'Decision to obtain old records',
  sentence: 'decision was made to obtain old records',
  points: 1,
  instancePoints: 0,
  allowedPoints: 1
},
{
  category: 'Review and summation of old records',
  sentence: 'old records were reviewed and summarized',
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

