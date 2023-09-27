import type { User, CodeType, UserInfo, PatientList, Patient } from '@/types/user'
import { request } from '@/utils/request'

// 说明 : 通过request.method<指定data数据类型>
// 密码登录
export const loginByPassword = (mobile: string, password: string) => {
  // User是定义返回数据的类型
  // post请求传递data可以直接{}传递
  return request.post<any, User>('/login/password', { mobile, password })
}

// 短信登录
export const loginByMobile = (mobile: string, code: string) => {
  return request.post<any, User>('/login', { mobile, code })
}

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  // 注意get请求传递Query参数格式
  return request.get<any, { code: string }>('/code', { params: { mobile, type } })
}

// 不加{}就是返回
// 获取用户详情信息
export const getUserInfo = () => request.get<any, UserInfo>('/patient/myUser')

// 获患者信息列表
export const getPatientList = () => request.get<any, PatientList>('patient/mylist')

// 新增患者
// 因为返回的东西也用不到, 因此post后可以不传入类型
export const addPatient = (patient: Patient) => request.post('patient/add', patient)

// 编辑患者信息
export const editPatient = (patient: Patient) => request.put('/patient/update', patient)

// 删除患者信息
export const delPatient = (id: string) => request.delete(`/patient/del/${id}`)

// 查询患者详情
export const getPatientDetail = (id: string) => request.get<any, Patient>(`/patient/info/${id}`)
