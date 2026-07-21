import { schemas } from "./schemas.js";
import { listServices } from "./listServices.js";
import { getServiceInfo } from "./getServiceInfo.js";
import { checkAvailability } from "./checkAvailability.js";
import { bookAppointment } from "./bookAppointment.js";
import { confirmBooking } from "./confirmBooking.js";
import { getCustomerInfo } from "./getCustomerInfo.js";
import { getMyAppointments } from "./getMyAppointments.js";
import { cancelAppointment } from "./cancelAppointment.js";
import { rescheduleAppointmentTool } from "./rescheduleAppointment.js";
import { getClinicInfo } from "./getClinicInfo.js";
import { escalateToHuman } from "./escalateToHuman.js";
import { submitFeedback } from "./submitFeedback.js";
import { rejectRequest } from "./rejectRequest.js";
import { getProductInfo } from "./getProductInfo.js";
import { getPromotions } from "./getPromotions.js";
import { getFaq } from "./getFaq.js";
import { requestConsultation } from "./requestConsultation.js";

export const toolSchemas = schemas;

export const handlers = {
  list_services: listServices,
  get_service_info: getServiceInfo,
  get_product_info: getProductInfo,
  get_promotions: getPromotions,
  get_faq: getFaq,
  check_availability: checkAvailability,
  book_appointment: bookAppointment,
  confirm_booking: confirmBooking,
  get_customer_info: getCustomerInfo,
  get_my_appointments: getMyAppointments,
  cancel_appointment: cancelAppointment,
  reschedule_appointment: rescheduleAppointmentTool,
  request_consultation: requestConsultation,
  get_clinic_info: getClinicInfo,
  submit_feedback: submitFeedback,
  reject_request: rejectRequest,
  escalate_to_human: escalateToHuman,
};
