package doser

import (
	"github.com/reef-pi/reef-pi/controller/connectors"
	"log"
	"time"
)

//https://www.rototron.info/raspberry-pi-stepper-motor-tutorial/
//swagger:model drv8825
type DRV8825 struct {
	StepPin       string  `json:"step_pin"`
	DirectionPin  string  `json:"direction_pin"`
	SPR           uint    `json:"spr"` // steps per revolution
	VPR           float64 `json:"vpr"` // steps per revolution
	MSPinA        string  `json:"ms_pin_a"`
	MSPinB        string  `json:"ms_pin_b"`
	MSPinC        string  `json:"ms_pin_c"`
	Direction     bool    `json:"direction"`
	MicroStepping string  `json:"microstepping"`
	Delay         float64 `json:"delay"`
}

const _defaultDelay = 208000

//	go r.Dose(cal.Speed, cal.Duration)
func (d *DRV8825) Step(outlets *connectors.Outlets, count int) error {
	delay := d.Delay
	if delay == 0 {
		delay = _defaultDelay
	}
	dPin, err := outlets.HalPin(d.DirectionPin)
	if err != nil {
		return err
	}
	sPin, err := outlets.HalPin(d.StepPin)
	if err != nil {
		return err
	}
	switch d.MicroStepping {
	case "Full":
		if err := d.Microstep(outlets, false, false, false); err != nil {
			return err
		}
	case "Half":
		delay = delay / 2
		if err := d.Microstep(outlets, true, false, false); err != nil {
			return err
		}
	case "1/4":
		delay = delay / 4
		if err := d.Microstep(outlets, false, true, false); err != nil {
			return err
		}
	case "1/8":
		delay = delay / 8
		if err := d.Microstep(outlets, true, true, false); err != nil {
			return err
		}
	case "1/16":
		delay = delay / 16
		if err := d.Microstep(outlets, false, false, true); err != nil {
			return err
		}
	case "1/32":
		fallthrough
	default:
		delay = delay / 32
		if err := d.Microstep(outlets, true, false, true); err != nil {
			return err
		}
	}

	if err := dPin.Write(d.Direction); err != nil {
		return err
	}
	for i := 0; i < count; i++ {
		if err := sPin.Write(true); err != nil {
			return err
		}
		time.Sleep(time.Duration(delay))
		if err := sPin.Write(false); err != nil {
			return err
		}
		time.Sleep(time.Duration(delay))
	}
	return nil
}

func (d *DRV8825) Microstep(outlets *connectors.Outlets, a, b, c bool) error {
	msPinA, err := outlets.HalPin(d.MSPinA)
	if err != nil {
		return err
	}
	msPinB, err := outlets.HalPin(d.MSPinA)
	if err != nil {
		return err
	}
	msPinC, err := outlets.HalPin(d.MSPinA)
	if err != nil {
		return err
	}
	if err := msPinA.Write(a); err != nil {
		return err
	}
	if err := msPinB.Write(b); err != nil {
		return err
	}
	if err := msPinC.Write(c); err != nil {
		return err
	}
	return nil
}

func (d *DRV8825) Dose(outlets *connectors.Outlets, volume float64) error {
	steps := (volume / d.VPR) * float64(d.SPR)
	log.Println("doser sub system: Executing stepper driver. Volume: ", volume, "SPR:", d.SPR, "vpr:", d.VPR, "steps:", steps)
	return d.Step(outlets, int(steps))
}