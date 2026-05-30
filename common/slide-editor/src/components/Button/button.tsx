/*
 * @Date: 2023-02-23 14:01:57
 * @LastEditors: wangpeng
 * @LastEditTime: 2023-04-03 11:09:15
 * @FilePath: /oliwans-ui/src/components/Button/button.tsx
 */
import React, {FC, ButtonHTMLAttributes, AnchorHTMLAttributes} from 'react'
import classNames from 'classnames'

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
    /**设置 Button 的类型 */
    btnType?: ButtonType,
    /**设置 Button 的尺寸 */
    size?: ButtonSize,
    /**设置 Button 的禁用 */
    disabled?: boolean,
    className: string,
    children: React.ReactNode,
    href?: string
}

export type NativeButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  } & BaseButtonProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>;
export type AnchorButtonProps = {
    href: string;
    target?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  } & BaseButtonProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, 'type' | 'onClick'>;
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

const Button: FC<ButtonProps> = (props) => {
    const {
        btnType,
        className,
        disabled,
        size,
        children,
        href,
        ...restProps
    } = props
    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
        const { onClick } = props;
        if (disabled) {
            e.preventDefault();
            return;
        }
        (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)?.(e);
    };
    const classes = classNames('btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        'disabled': btnType === 'link' && disabled
    })
    return btnType === 'link' && href ? (
        <a
            className={classes}
            href={href}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </a>
    ) : (
        <button
            className={classes}
            disabled={disabled}
            onClick={handleClick}
            {...restProps}
        >
            {children}
        </button>
    )
}

Button.defaultProps = {
    btnType: 'default',
    disabled: false,
}

export default Button;