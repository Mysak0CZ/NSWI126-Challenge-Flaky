import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Main } from "../src/main";
import React from 'react';

describe('Good test', () => {
	it('expects hello world', () => {
		render(<Main />);

		expect(screen.getByTestId("main-content")).toHaveTextContent("Hello world!");
	});
});
