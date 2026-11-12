import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import Countdown from './Countdown.jsx';

afterEach(cleanup);
const at = (iso) => () => Date.parse(iso);

describe('Countdown', () => {
  it('before the day: Gujarati digits with unit labels', async () => {
    await act(async () => render(<Countdown now={at('2026-12-12T18:00:00+05:30')} />));
    expect(screen.getByTestId('cd-days').textContent).toBe('૧');
    expect(screen.getByTestId('cd-hours').textContent).toBe('૦૦');
    expect(screen.getByText('દિવસ')).toBeTruthy();
    expect(screen.getByText('સેકન્ડ')).toBeTruthy();
  });

  it('on the wedding day (IST) before 6 pm: today message plus remaining time', async () => {
    await act(async () => render(<Countdown now={at('2026-12-13T00:30:00+05:30')} />));
    expect(screen.getByText('આજે શુભ દિવસ છે!')).toBeTruthy();
    expect(screen.getByTestId('cd-hours').textContent).toBe('૧૭');
  });

  it('after 6 pm on the day: thank-you message, no units', async () => {
    await act(async () => render(<Countdown now={at('2026-12-13T18:00:00+05:30')} />));
    expect(screen.getByText('શુભ લગ્ન સંપન્ન — આપના આશીર્વાદ બદલ આભાર')).toBeTruthy();
    expect(screen.queryByTestId('cd-days')).toBeNull();
  });
});
