import * as Yup from 'yup'
import i18n from 'utils/i18n'

const Stepperchema = Yup.object().shape({
  direction_pin: Yup.string().required(i18n.t('validation:selection_required')),
  step_pin: Yup.string().required(i18n.t('validation:selection_required')),
  ms_pin_a: Yup.string().required(i18n.t('validation:selection_required')),
  ms_pin_b: Yup.string().required(i18n.t('validation:selection_required')),
  ms_pin_c: Yup.string().required(i18n.t('validation:selection_required')),
  spr: Yup.number().required(i18n.t('validation:number_required')),
  delay: Yup.number().required(i18n.t('validation:number_required')),
  vpr: Yup.number().required(i18n.t('validation:number_required')),
  direction: Yup.bool().required(i18n.t('validation:selection_required')),
  microstepping: Yup.string().required(i18n.t('validation:selection_required'))
})

const DoserSchema = Yup.object().shape({
  name: Yup.string()
    .required(i18n.t('validation:name_required')),
  jack: Yup.string()
    .required(i18n.t('validation:selection_required')),
  pin: Yup.string()
    .required(i18n.t('validation:selection_required')),
  stepper: Stepperchema,
  enable: Yup.bool()
    .required(i18n.t('validation:selection_required')),
  duration: Yup.number()
    .required(i18n.t('validation:number_required'))
    .typeError(i18n.t('validation:number_required'))
    .min(1, i18n.t('validation:integer_min_required')),
  speed: Yup.number()
    .required(i18n.t('validation:number_required'))
    .typeError(i18n.t('validation:number_required'))
    .min(1, i18n.t('validation:integer_min_required'))
    .max(100, i18n.t('validation:integer_max_required')),
  month: Yup.string()
    .required(i18n.t('validation:cron_required'))
    // cron expression:
    // either a joker '*'
    // or a number (range depends on field, some accept slightly too much)
    //    optionally followed by a single range '-' or increment '/', and same digits
    //    or optionally followed by a comma separated list of same digits
    .matches(/^(\*|[1]?\d([-/][1]?\d)?|[1]?\d(,[1]?\d)*)$/, i18n.t('validation:cron_required')),
  week: Yup.string()
    .required(i18n.t('validation:cron_required'))
    .matches(/^(\*|[0-6]([-/][0-6])?|[0-6](,[0-6])*)$/, i18n.t('validation:cron_required')),
  day: Yup.string()
    .required(i18n.t('validation:cron_required'))
    .matches(/^(\*|[123]?\d([-/][123]?\d)?|[123]?\d(,[123]?\d)*)$/, i18n.t('validation:cron_required')),
  hour: Yup.string()
  // 6,12,19
    .required(i18n.t('validation:cron_required'))
    .matches(/^(\*|[12]?\d([-/][12]?\d)?|[12]?\d(,[12]?\d)*)$/, i18n.t('validation:cron_required')),
  minute: Yup.string()
    .required(i18n.t('validation:cron_required'))
    .matches(/^(\*|[1-5]?\d([-/][1-5]?\d)?|[1-5]?\d(,[1-5]?\d)*)$/, i18n.t('validation:cron_required')),
  second: Yup.string()
    .required(i18n.t('validation:cron_nojoker_required'))
    .matches(/^([1-5]?\d([-/][1-5]?\d)?|[1-5]?\d(,[1-5]?\d)*)$/, i18n.t('validation:cron_nojoker_required'))
})

export default DoserSchema
