// 问诊类型：1 == 找医生 2 == 极速问诊 3 == 开药问诊
export enum ConsultType {
  Doctor = 1,
  Fast = 2,
  Medication = 3
}
// 患病时间：1一周内2一月内3半年内4半年以上
export enum ConsultTime {
  Week = 1,
  Month,
  HalfYear,
  More
}
