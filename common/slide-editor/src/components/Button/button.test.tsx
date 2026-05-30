/*
 * @Date: 2023-02-24 11:21:41
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-04-02 22:52:20
 * @FilePath: /oliwans-ui/src/components/Button/button.test.tsx
 */
import {render, fireEvent, screen} from '@testing-library/react'
import Button, {ButtonProps} from './button'

const defaultProps = {
    onClick: jest.fn()
}

const disabledProps = {
    onClick: jest.fn(),
    disabled: true
}

const testProps: ButtonProps = {
    btnType: 'primary',
    size: 'lg',
    className: 'klass'
}

describe('test button component', () => {
    it('should render the correct default button', () => {
        render(<Button {...defaultProps}>default button</Button>)
        const element = screen.getByText('default button') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.tagName).toBe('BUTTON')
        expect(element).toHaveClass('btn btn-default')
        expect(element.disabled).toBeFalsy()
        fireEvent.click(element)
        expect(defaultProps.onClick).toHaveBeenCalled()
    })
    it('should render the correct component based on different props', () => {
        render(<Button {...testProps}>large button</Button>)
        const element = screen.getByText('large button') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element).toHaveClass('btn btn-primary btn-lg klass')
    })
    it('should render a link when btnType equals link and href is provided', () => {
        render(<Button btnType="link" href="#">link</Button>)
        const element = screen.getByText('link') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.tagName).toEqual('A')
        expect(element).toHaveClass('btn-link')
    })
    it('should render disabled button when disabled set to true', () => {
        render(<Button {...disabledProps}>disabled</Button>)
        const element = screen.getByText('disabled') as HTMLButtonElement
        expect(element).toBeInTheDocument()
        expect(element.disabled).toBeTruthy()
        fireEvent.click(element)
        expect(disabledProps.onClick).not.toHaveBeenCalled()
    })
})