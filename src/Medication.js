import supabase from './supabaseClient'

async function insertMedication(medicationData) {
  const { data, error } = await supabase
    .from('Medication')
    .insert([medicationData])

  if (error) {
    console.error('Error inserting data:', error)
    return null
  }

  return data
}

document.getElementById('medicationForm').addEventListener('submit', async (event) => {
  event.preventDefault()

  const medicationData = {
    PatientID: document.getElementById('patientId').value,
    ItemName: document.getElementById('itemName').value,
    UnitsPerDay: document.getElementById('unitsPerDay').value,
    AdministrationMethod: document.getElementById('administrationMethod').value,
    StartDate: document.getElementById('startDate').value,
    EndDate: document.getElementById('endDate').value,
    SupplyID: document.getElementById('supplyId').value,
    StaffID: document.getElementById('staffId').value,
  }

  const result = await insertMedication(medicationData)

  if (result) {
    console.log('Medication data inserted successfully:', result)
  } else {
    console.log('Failed to insert medication data.')
  }
})
